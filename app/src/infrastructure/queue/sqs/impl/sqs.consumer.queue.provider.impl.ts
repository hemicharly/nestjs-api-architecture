import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  ChangeMessageVisibilityCommand,
  DeleteMessageCommand,
  Message,
  ReceiveMessageCommand,
  SQSClient
} from '@aws-sdk/client-sqs';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { SQS_HANDLER_METADATA } from '@shared/config/sqs/decorators';
import { SqsDecoratorType } from '@shared/config/sqs/decorators/types';
import { TracerContextAudit } from '@shared/audit';
import { ConfigEnvProviderInterface } from '@core/providers/config-env';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';
import { SqsBuilderConfig } from '@shared/config/sqs';

@Injectable()
export class SqsConsumerQueueProviderImpl implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SqsConsumerQueueProviderImpl.name);

  /**
   * AWS SQS client used for interacting with queues.
   */
  private readonly sqsClient: SQSClient;

  /**
   * A map of registered queue handlers.
   * - Key: Queue configuration (e.g., queueName, batchSize).
   * - Value: The handler function to process messages.
   */
  private readonly handlers = new Map<SqsDecoratorType, Function>();

  /**
   * A map of polling intervals for each queue.
   * - Key: Queue URL.
   * - Value: NodeJS timeout object for the polling process.
   */
  private readonly pollingIntervals = new Map<string, NodeJS.Timeout>();

  /**
   * Flag to indicate if the application is shutting down.
   */
  private isShuttingDown: boolean = false;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    @Inject(ConfigEnvProviderImpl)
    private readonly configEnvProvider: ConfigEnvProviderInterface
  ) {
    this.sqsClient = SqsBuilderConfig.builderClient(this.configEnvProvider);
  }

  /**
   * Lifecycle hook triggered when the module is initialized.
   * - Registers message handlers.
   * - Starts the polling process for SQS messages.
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('SQS Consumer initialized.');
    this.registerHandlers();
    this.startPolling();
  }

  /**
   * Lifecycle hook triggered when the module is destroyed.
   * - Stops all polling processes.
   * - Marks the consumer as shutting down.
   */
  async onModuleDestroy(): Promise<void> {
    this.isShuttingDown = true;
    this.logger.log('Shutting down SQS Consumer...');
    this.stopAllPolling();
    await Promise.all(
      [...this.pollingIntervals.values()].map((interval) => clearTimeout(interval))
    );
    this.logger.log('All polling operations stopped.');
  }

  /**
   * Registers all available handlers for SQS queues.
   * - Scans through discovered providers and extracts methods annotated with specific metadata.
   */
  private registerHandlers(): void {
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
          const {
            queueNameEnv,
            batchSize,
            waitTimeSeconds,
            visibilityTimeout,
            enabledVisibilityTimeout
          } = metadata;
          this.handlers.set(
            {
              queueNameEnv,
              batchSize,
              waitTimeSeconds,
              visibilityTimeout,
              enabledVisibilityTimeout
            },
            method.bind(instance)
          );
        }
      }
    }
  }

  /**
   * Builds the command to receive messages from an SQS queue.
   * @param queueUrl - queue URL.
   * @param sqsDecoratorsTypes - Configuration of the handler associated with the queue.
   * @returns Command configured to receive messages.
   */
  private builderReceiveMessageCommand(
    queueUrl: string,
    sqsDecoratorsTypes: SqsDecoratorType
  ): ReceiveMessageCommand {
    return new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: sqsDecoratorsTypes.batchSize || 10,
      WaitTimeSeconds: sqsDecoratorsTypes.waitTimeSeconds || 20,
      VisibilityTimeout: sqsDecoratorsTypes.visibilityTimeout || 30,
      MessageAttributeNames: ['All']
    });
  }

  /**
   * Starts polling for messages from all registered SQS queues.
   * - Implements exponential backoff in case of errors.
   */
  private startPolling(): void {
    let backoffTime = 1000; // Start with 1s
    const maxBackoffTime = 30000; // Maximum backoff time is 30s

    const poll = async (): Promise<void> => {
      if (this.isShuttingDown) return;

      for (const [
        { queueNameEnv, batchSize, waitTimeSeconds, visibilityTimeout, enabledVisibilityTimeout },
        handler
      ] of this.handlers.entries()) {
        const queueName = this.configEnvProvider.getString(queueNameEnv);
        const queueUrl = SqsBuilderConfig.builderQueueUrl(queueName, this.configEnvProvider);
        try {
          const command = this.builderReceiveMessageCommand(queueUrl, {
            queueNameEnv,
            batchSize,
            waitTimeSeconds,
            visibilityTimeout,
            enabledVisibilityTimeout
          });

          const response = await this.sqsClient.send(command);
          const messages = response.Messages;
          if (messages && messages.length > 0) {
            this.logger.log(`[QueueName: ${queueName}] Received ${messages.length} messages.`);
            await this.handlerMessage(
              messages,
              handler,
              queueUrl,
              queueName,
              enabledVisibilityTimeout,
              visibilityTimeout
            );
            backoffTime = 1000;
          }
        } catch (error) {
          this.logger.error(
            `[QueueName: ${queueName}] Unhandled error: ${error.message}`,
            error.stack
          );
        } finally {
          if (!this.isShuttingDown) {
            backoffTime = Math.min(backoffTime * 2, maxBackoffTime);
            this.pollingIntervals.set(
              queueUrl,
              setTimeout(() => poll(), backoffTime)
            );
          }
        }
      }
    };

    poll();
  }

  /**
   * Processes incoming messages and runs the associated handler.
   * @param messages - Messages received.
   * @param handler - Function that will process messages.
   * @param queueUrl - Queue URL.
   * @param queueName - Name of the queue.
   * @param enabledVisibilityTimeout - Flag indicating whether the timeout should be adjusted.
   * @param visibilityTimeout - Configured visibility timeout.
   */
  private async handlerMessage(
    messages: Message[],
    handler: Function,
    queueUrl: string,
    queueName: string,
    enabledVisibilityTimeout: boolean,
    visibilityTimeout: number
  ): Promise<void> {
    for (const message of messages) {
      try {
        TracerContextAudit.setContextTracerId(message?.MessageAttributes?.TracerId?.StringValue);
        await handler(message);
        await this.deleteMessage(queueUrl, message.ReceiptHandle!);
      } catch (error) {
        this.logger.error(
          `[QueueName: ${queueName}] Error processing message: ${error.message}`,
          error.stack
        );
        if (enabledVisibilityTimeout === true) {
          await this.extendVisibilityTimeout(
            queueUrl,
            message.ReceiptHandle!,
            visibilityTimeout || 60
          );
        }
      }
    }
  }

  /**
   * Deletes a processed message from the SQS queue.
   * @param queueUrl - The URL of the SQS queue.
   * @param receiptHandle - The receipt handle of the message.
   */
  private async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    if (!receiptHandle) {
      this.logger.warn(`[QueueUrl: ${queueUrl}] Invalid receipt handle for queue.`);
      return;
    }

    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
      });
      await this.sqsClient.send(command);
      this.logger.debug(`[QueueUrl: ${queueUrl}] Message deleted from queue.`);
    } catch (error) {
      this.logger.error(
        `[QueueUrl: ${queueUrl}] Error deleting message from queue. Error: ${error.message}`,
        error.stack
      );
    }
  }

  /**
   * Extends the visibility timeout for a message in the SQS queue.
   * @param queueUrl - The URL of the SQS queue.
   * @param receiptHandle - The receipt handle of the message.
   * @param visibilityTimeout - The new visibility timeout in seconds.
   */
  private async extendVisibilityTimeout(
    queueUrl: string,
    receiptHandle: string,
    visibilityTimeout: number
  ): Promise<void> {
    if (!receiptHandle) {
      this.logger.warn(`[QueueUrl: ${queueUrl}] Invalid receipt handle for queue.`);
      return;
    }

    try {
      const command = new ChangeMessageVisibilityCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
        VisibilityTimeout: visibilityTimeout
      });
      await this.sqsClient.send(command);
      this.logger.debug(
        `[QueueUrl: ${queueUrl}] Extended visibility timeout for message in queue: ${queueUrl}`
      );
    } catch (error) {
      this.logger.error(
        `[QueueUrl: ${queueUrl}] Error extending visibility timeout for queue: ${queueUrl}, Error: ${error.message}`,
        error.stack
      );
    }
  }

  /**
   * Stops all ongoing polling processes.
   * - Clears all registered intervals for polling.
   */
  private stopAllPolling(): void {
    for (const [url, interval] of this.pollingIntervals) {
      clearTimeout(interval);
      this.logger.log(`Stopped polling for queue: ${url}`);
    }
  }
}
