import { ProducerQueueProvider } from '@core/providers/queue';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { TracerContextAudit } from '@shared/audit';
import { SqsBuilderConfig } from '@shared/config/sqs';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';
import { ConfigEnvProvider } from '@core/providers/config-env';

@Injectable()
export class SqsProducerQueueProviderImpl implements ProducerQueueProvider {
  private readonly logger = new Logger(SqsProducerQueueProviderImpl.name);
  private readonly sqsClient: SQSClient;

  constructor(
    @Inject(ConfigEnvProviderImpl)
    private readonly configEnvProvider: ConfigEnvProvider,
  ) {
    this.sqsClient = SqsBuilderConfig.builderClient(this.configEnvProvider);
  }

  public async sendMessage(queueName: string, message: string): Promise<void> {
    try {
      const queueUrl = SqsBuilderConfig.builderQueueUrl(queueName, this.configEnvProvider);
      const sendMessageCommand = new SendMessageCommand({
        MessageBody: message,
        QueueUrl: queueUrl,
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
      const queueUrl = SqsBuilderConfig.builderQueueUrl(queueName, this.configEnvProvider);
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
        QueueUrl: queueUrl,
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
