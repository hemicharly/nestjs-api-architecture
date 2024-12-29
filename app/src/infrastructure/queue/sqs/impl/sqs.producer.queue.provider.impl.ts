import { ProducerQueueProvider } from '@core/providers/queue';
import { Injectable, Logger } from '@nestjs/common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { configEnv } from '@src/shared/config';
import { SQSClientConfig } from '@aws-sdk/client-sqs/dist-types/SQSClient';
import { TracerContextAudit } from '@shared/audit';

@Injectable()
export class SqsProducerQueueProviderImpl implements ProducerQueueProvider {
  private readonly logger = new Logger(SqsProducerQueueProviderImpl.name);
  private readonly sqsClient: SQSClient;

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

  public async sendMessage(queueName: string, message: string): Promise<void> {
    try {
      const sendMessageCommand = new SendMessageCommand({
        MessageBody: message,
        QueueUrl: `${configEnv.aws.sqs.queueUrl(queueName)}`,
        MessageAttributes: {
          TracerId: {
            DataType: 'String',
            StringValue: TracerContextAudit.getContextTracerId(),
          },
        },
      });
      this.logger.log(`[QueueName: ${queueName}] Send message to SQS.`);
      await this.sqsClient.send(sendMessageCommand);
    } catch (e) {
      this.logger.error(`[QueueName: ${queueName}] Failed to send message to SQS.`, e.stack);
      throw e;
    }
  }

  public async sendMessageWithDelayAndAttempt(queueName: string, message: string, delaySeconds: number, attempt: number): Promise<void> {
    try {
      const sendMessageCommand = new SendMessageCommand({
        MessageBody: message,
        MessageAttributes: {
          TracerId: {
            DataType: 'String',
            StringValue: TracerContextAudit.getContextTracerId(),
          },
          AttemptCount: {
            DataType: 'String',
            StringValue: String(attempt),
          },
        },
        QueueUrl: `${configEnv.aws.sqs.queueUrl(queueName)}`,
        DelaySeconds: delaySeconds || 0,
      });
      this.logger.log(`[QueueName: ${queueName}] Send message to SQS with delay and attempt.`);
      await this.sqsClient.send(sendMessageCommand);
    } catch (e) {
      this.logger.error(`[QueueName: ${queueName}] Failed to send message to SQS with delay and attempt.`, e.stack);
      throw e;
    }
  }
}
