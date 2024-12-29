import { Module } from '@nestjs/common';
import { WebhookIntegrationClientModule } from '@infrastructure/integrations/webhook-client';
import { SqsConsumerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { UsecaseProviderConfig } from '@application/config/usecases/abstract';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
import { NotificationOrderConsumerService } from '@application/consumers/notification';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule, WebhookIntegrationClientModule],
  providers: [SqsConsumerQueueProviderImpl, UsecaseProviderConfig(NotificationSendWebhookUsecaseImpl, [WebhookIntegrationClientProviderImpl]), NotificationOrderConsumerService],
})
export class ConsumerModule {}
