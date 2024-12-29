import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { SqsConsumerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { configEnv } from '@src/shared/config';
import { Message } from '@aws-sdk/client-sqs';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { NotificationSendWebhookUsecase } from '@core/usecases/notification';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
import { UsecaseProviderConfig } from '@src/modules/config/usecases/abstract';
import { WebhookIntegrationClientModule } from 'src/infrastructure/integrations/webhook-client';

@Module({
  imports: [WebhookIntegrationClientModule],
  providers: [SqsConsumerQueueProviderImpl, UsecaseProviderConfig(NotificationSendWebhookUsecaseImpl, [WebhookIntegrationClientProviderImpl])],
})
export class NotificationOrderConsumerModule implements OnModuleInit {

  private readonly logger = new Logger(SqsConsumerQueueProviderImpl.name);

  @Inject(NotificationSendWebhookUsecaseImpl.name)
  private readonly notificationSendWebhookUsecase: NotificationSendWebhookUsecase;

  constructor(private readonly sqsConsumerQueueProvider: SqsConsumerQueueProviderImpl) {}

  onModuleInit() {
    this.sqsConsumerQueueProvider.registerQueueHandler(
      {
        name: configEnv.aws.sqs.queues.queueNotificationOrder,
        url: configEnv.aws.sqs.queueUrl(configEnv.aws.sqs.queues.queueNotificationOrder),
        waitTimeSeconds: 5,
        batchSize: 10,
        visibilityTimeout: 60,
      },
      async (message: Message) => {
        if (!message || !message.Body) {
          this.logger.warn(`Empty message body received in queue: ${configEnv.aws.sqs.queues.queueNotificationOrder}`);
          return;
        }
        await this.notificationSendWebhookUsecase.execute(message.Body);
      },
    );
  }
}
