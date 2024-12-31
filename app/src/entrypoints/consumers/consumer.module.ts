import { Module } from '@nestjs/common';
import { WebhookIntegrationClientModule } from '@infrastructure/integrations/webhook-client';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
import { NotificationOrderConsumerService } from '@entrypoints/consumers/notification';
import { UsecaseProviderConfig } from '@shared/config/abstract';
import { SqsQueueInfraModule } from '@infrastructure/queue/sqs';

@Module({
  imports: [SqsQueueInfraModule, WebhookIntegrationClientModule],
  providers: [UsecaseProviderConfig(NotificationSendWebhookUsecaseImpl, [WebhookIntegrationClientProviderImpl]), NotificationOrderConsumerService],
})
export class ConsumerModule {}
