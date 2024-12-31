import { Module } from '@nestjs/common';
import { WebhookIntegrationClientModule } from '@infrastructure/integrations/webhook-client';
import { SqsConsumerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
import { NotificationOrderConsumerService } from '@entrypoints/consumers/notification';
import { DiscoveryModule } from '@nestjs/core';
import { UsecaseProviderConfig } from '@shared/config/abstract';

const notificationProvider = [UsecaseProviderConfig(NotificationSendWebhookUsecaseImpl, [WebhookIntegrationClientProviderImpl]), NotificationOrderConsumerService];

@Module({
  imports: [DiscoveryModule, WebhookIntegrationClientModule],
  providers: [SqsConsumerQueueProviderImpl, ...notificationProvider],
})
export class ConsumerModule {}
