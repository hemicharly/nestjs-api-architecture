import { Module } from '@nestjs/common';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
import { NotificationOrderConsumerService } from '@entrypoints/consumers/notification';
import { DynamicConfigModule } from '@shared/config';
import { InfrastructureModule } from '@src/infrastructure';

@Module({
  imports: [InfrastructureModule],
  providers: [DynamicConfigModule.forProvider(NotificationSendWebhookUsecaseImpl, [WebhookIntegrationClientProviderImpl]), NotificationOrderConsumerService],
})
export class ConsumerModule {}
