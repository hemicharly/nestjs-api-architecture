import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@src/infrastructure';
import { DynamicConfigModule } from '@shared/config';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';

const dynamicProvider = [DynamicConfigModule.forProvider(NotificationSendWebhookUsecaseImpl, [WebhookIntegrationClientProviderImpl])];

@Module({
  imports: [InfrastructureModule],
  providers: dynamicProvider,
  exports: dynamicProvider,
})
export class NotificationConsumerConfigModule {}
