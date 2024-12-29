import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ChangeMessageVisibilityCommand, DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { SQSClientConfig } from '@aws-sdk/client-sqs/dist-types/SQSClient';
import { configEnv } from '@shared/config';
import { SQS_HANDLER_METADATA } from '@infrastructure/queue/sqs/config/decorators';
import { SqsDecoratorsTypes } from '@infrastructure/queue/sqs/config/decorators/types';
import { TracerContextAudit } from '@shared/audit';

@Injectable()
export class SqsConsumerQueueProviderImpl implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsConsumerQueueProviderImpl.name);
  private readonly sqsClient: SQSClient;
  private readonly handlers = new Map<SqsDecoratorsTypes, Function>();
  private readonly pollingIntervals = new Map<string, NodeJS.Timeout>();
  private isShuttingDown = false;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {
    const config: SQSClientConfig = {
      region: configEnv.aws.region,
    };
    if (configEnv.nodeEnv === 'development') {
      config.credentials = { accessKeyId: 'test', secretAccessKey: 'test' };
      config.endpoint = configEnv.aws.sqs.endpoint;
    }
    this.sqsClient = new SQSClient(config);
  }

  async onModuleInit() {
    this.logger.log('SQS Consumer initialized.');
    this.registerHandlers();
    this.startPolling();
  }

  async onModuleDestroy() {
    this.isShuttingDown = true;
    this.logger.log('Shutting down sqs consumer...');
    this.stopAllPolling();
    await Promise.all([...this.pollingIntervals.values()].map((interval) => clearTimeout(interval)));
    this.logger.log('All polling operations stopped.');
  }

  private registerHandlers() {
    const providers = this.discoveryService.getProviders();
    for (const provider of providers) {
      const { instance } = provider;
      if (!instance) {
        continue;
      }

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = this.metadataScanner.getAllMethodNames(prototype);
      for (const methodName of methodNames) {
        const method = prototype[methodName];
        const metadata = Reflect.getMetadata(SQS_HANDLER_METADATA, method);
        if (metadata) {
          const { queueName, batchSize, waitTimeSeconds, visibilityTimeout, enabledVisibilityTimeout } = metadata;
          this.handlers.set(
            {
              queueName,
              batchSize,
              waitTimeSeconds,
              visibilityTimeout,
              enabledVisibilityTimeout,
            },
            method.bind(instance),
          );
        }
      }
    }
  }

  private startPolling(): void {
    let backoffTime = 1000; // Start with 1s
    const maxBackoffTime = 30000; // Time max of 30s

    const poll = async () => {
      if (this.isShuttingDown) {
        return;
      }
      for (const [{ queueName, batchSize, waitTimeSeconds, visibilityTimeout, enabledVisibilityTimeout }, handler] of this.handlers.entries()) {
        const queueUrl = configEnv.aws.sqs.queueUrl(queueName);
        try {
          const command = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: batchSize || 10,
            WaitTimeSeconds: waitTimeSeconds || 20,
            VisibilityTimeout: visibilityTimeout || 30,
            MessageAttributeNames: ['All'],
          });

          const response = await this.sqsClient.send(command);
          const messages = response.Messages;
          if (messages && messages.length > 0) {
            this.logger.log(`[QueueName: ${queueName}] Received ${messages.length} messages.`);
            for (const message of messages) {
              try {
                TracerContextAudit.setContextTracerId(message?.MessageAttributes?.TracerId?.StringValue);
                await handler(message);
                await this.deleteMessage(queueUrl, message.ReceiptHandle!);
              } catch (error) {
                this.logger.error(`[QueueName: ${queueName}] Error processing message: ${error.message}`, error.stack);
                if (enabledVisibilityTimeout === true) {
                  await this.extendVisibilityTimeout(queueUrl, message.ReceiptHandle!, visibilityTimeout || 60);
                }
              }
            }
            backoffTime = 1000;
          }
        } catch (error) {
          this.logger.error(`[QueueName: ${queueName}] Unhandled error: ${error.message}`, error.stack);
        } finally {
          if (!this.isShuttingDown) {
            backoffTime = Math.min(backoffTime * 2, maxBackoffTime);
            this.pollingIntervals.set(
              queueUrl,
              setTimeout(() => poll(), backoffTime),
            );
          }
        }
      }
    };

    poll();
  }

  private async deleteMessage(queueUrl: string, receiptHandle: string) {
    if (!receiptHandle) {
      this.logger.warn(`[QueueUrl: ${queueUrl}] Invalid receipt handle for queue.`);
      return;
    }

    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });
      await this.sqsClient.send(command);
      this.logger.debug(`[QueueUrl: ${queueUrl}] Message deleted from queue.`);
    } catch (error) {
      this.logger.error(`[QueueUrl: ${queueUrl}] Error deleting message from queue. Error: ${error.message}`, error.stack);
    }
  }

  private async extendVisibilityTimeout(queueUrl: string, receiptHandle: string, visibilityTimeout: number) {
    if (!receiptHandle) {
      this.logger.warn(`[QueueUrl: ${queueUrl}] Invalid receipt handle for queue.`);
      return;
    }

    try {
      const command = new ChangeMessageVisibilityCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: visibilityTimeout,
      });
      await this.sqsClient.send(command);
      this.logger.debug(`[QueueUrl: ${queueUrl}] Extended visibility timeout for message in queue: ${queueUrl}`);
    } catch (error) {
      this.logger.error(`[QueueUrl: ${queueUrl}] Error extending visibility timeout for queue: ${queueUrl}, Error: ${error.message}`, error.stack);
    }
  }

  private stopAllPolling() {
    for (const [url, interval] of this.pollingIntervals) {
      clearTimeout(interval);
      this.logger.log(`Stopped polling for queue: ${url}`);
    }
  }
}
