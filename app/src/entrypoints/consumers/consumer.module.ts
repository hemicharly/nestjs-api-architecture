import { Module } from '@nestjs/common';
import { WebhookIntegrationClientModule } from '@infrastructure/integrations/webhook-client';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
import { NotificationOrderConsumerService } from '@entrypoints/consumers/notification';
import { DynamicConfigModule } from '@shared/config';
import { SqsQueueInfraModule } from '@infrastructure/queue/sqs';

@Module({
  imports: [SqsQueueInfraModule, WebhookIntegrationClientModule],
  providers: [DynamicConfigModule.forProvider(NotificationSendWebhookUsecaseImpl, [WebhookIntegrationClientProviderImpl]), NotificationOrderConsumerService],
})
export class ConsumerModule {}
