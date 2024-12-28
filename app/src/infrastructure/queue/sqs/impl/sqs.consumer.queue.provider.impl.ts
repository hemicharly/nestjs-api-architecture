import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ChangeMessageVisibilityCommand, DeleteMessageCommand, Message, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { SQSClientConfig } from '@aws-sdk/client-sqs/dist-types/SQSClient';
import { configEnv } from '@src/config.env';

interface SqsHandler {
  (message: Message): Promise<void>;
}

interface QueueConfig {
  name: string;
  url: string;
  visibilityTimeout?: number;
  waitTimeSeconds?: number;
  batchSize?: number;
}

@Injectable()
export class SqsConsumerQueueProviderImpl implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsConsumerQueueProviderImpl.name);
  private readonly sqsClient: SQSClient;
  private readonly queueHandlers = new Map<string, SqsHandler>();
  private readonly pollingIntervals = new Map<string, NodeJS.Timeout>();
  private isShuttingDown = false;

  constructor() {
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
    this.logger.log('SqsConsumerQueueProviderImpl initialized.');
  }

  async onModuleDestroy() {
    this.isShuttingDown = true;
    this.logger.log('Shutting down SqsConsumerQueueProviderImpl...');
    this.stopAllPolling();
  }

  registerQueueHandler(queueConfig: QueueConfig, handler: SqsHandler) {
    if (this.queueHandlers.has(queueConfig.url)) {
      throw new Error(`Handler for queue ${queueConfig.name} is already registered.`);
    }
    this.queueHandlers.set(queueConfig.url, handler);
    this.startPolling(queueConfig);
  }

  private startPolling(queueConfig: QueueConfig) {
    const { name, url } = queueConfig;
    let backoffTime = 1000; // Start with 1s
    const maxBackoffTime = 30000; // Time max of 30s

    const poll = async () => {
      if (this.isShuttingDown) {
        return;
      }

      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: url,
          MaxNumberOfMessages: queueConfig.batchSize || 10,
          WaitTimeSeconds: queueConfig.waitTimeSeconds || 20,
          VisibilityTimeout: queueConfig.visibilityTimeout || 30,
        });

        const response = await this.sqsClient.send(command);
        const messages = response.Messages;

        if (messages && messages.length > 0) {
          this.logger.log(`[${name}] Received ${messages.length} messages.`);
          for (const message of messages) {
            try {
              const handler = this.queueHandlers.get(url);
              if (!handler) {
                throw new Error(`No handler registered for queue ${name}`);
              }
              await handler(message);
              await this.deleteMessage(url, message.ReceiptHandle!);
            } catch (error) {
              this.logger.error(`[${name}] Error processing message: ${error.message}`);
              await this.extendVisibilityTimeout(url, message.ReceiptHandle!, queueConfig.visibilityTimeout || 30);
            }
          }
          backoffTime = 1000;
        }
      } catch (error) {
        this.logger.error(`[${name}] Error receiving messages: ${error.message}`);
      } finally {
        if (!this.isShuttingDown) {
          backoffTime = Math.min(backoffTime * 2, maxBackoffTime);
          this.pollingIntervals.set(
            url,
            setTimeout(() => poll(), backoffTime),
          );
        }
      }
    };

    poll();
  }

  private async deleteMessage(queueUrl: string, receiptHandle: string) {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });
      await this.sqsClient.send(command);
      this.logger.debug(`Message deleted from queue: ${queueUrl}.`);
    } catch (error) {
      this.logger.error(`Error deleting message from queue: ${queueUrl}, Error: ${error.message}`);
    }
  }

  private async extendVisibilityTimeout(queueUrl: string, receiptHandle: string, visibilityTimeout: number) {
    try {
      const command = new ChangeMessageVisibilityCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: visibilityTimeout,
      });
      await this.sqsClient.send(command);
      this.logger.debug(`Extended visibility timeout for message in queue: ${queueUrl}`);
    } catch (error) {
      this.logger.error(`Error extending visibility timeout for queue: ${queueUrl}, Error: ${error.message}`);
    }
  }

  private stopAllPolling() {
    for (const [url, interval] of this.pollingIntervals) {
      clearTimeout(interval);
      this.logger.log(`Stopped polling for queue: ${url}`);
    }
  }
}
