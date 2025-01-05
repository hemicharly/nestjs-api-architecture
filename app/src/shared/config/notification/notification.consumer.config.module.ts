import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@src/infrastructure';
import { DynamicConfigModule } from '@shared/config';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';

@Module({
  imports: [InfrastructureModule],
  ...DynamicConfigModule.forProviderRegister([
    {
      useClass: NotificationSendWebhookUsecaseImpl,
      injects: [WebhookIntegrationClientProviderImpl]
    }
  ])
})
export class NotificationConsumerConfigModule {}
