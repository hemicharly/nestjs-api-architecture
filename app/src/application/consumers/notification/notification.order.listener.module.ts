import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { SqsConsumerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { configEnv } from '@src/config.env';
import { Message } from '@aws-sdk/client-sqs';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { NotificationSendWebhookUsecase } from '@core/usecases/notification';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/integration-client/impl';
import { UsecaseProviderConfig } from '@application/config/usecases/abstract';
import { WebhookIntegrationClientModule } from '@infrastructure/integrations/integration-client';

@Module({
  imports: [WebhookIntegrationClientModule],
  providers: [SqsConsumerQueueProviderImpl, UsecaseProviderConfig(NotificationSendWebhookUsecaseImpl, [WebhookIntegrationClientProviderImpl])],
})
export class NotificationOrderListenerModule implements OnModuleInit {
  @Inject(NotificationSendWebhookUsecaseImpl.name)
  private readonly notificationSendWebhookUsecase: NotificationSendWebhookUsecase;

  constructor(private readonly sqsConsumerQueueProvider: SqsConsumerQueueProviderImpl) {}

  onModuleInit() {
    const queueName = configEnv.aws.sqs.queues.queueNotificationOrder;
    this.sqsConsumerQueueProvider.registerQueueHandler(
      {
        name: queueName,
        url: configEnv.aws.sqs.queueUrl(queueName),
        waitTimeSeconds: 5,
        batchSize: 10,
        visibilityTimeout: 60,
      },
      async (message: Message) => {
        await this.notificationSendWebhookUsecase.execute(message.Body);
      },
    );
  }
}
