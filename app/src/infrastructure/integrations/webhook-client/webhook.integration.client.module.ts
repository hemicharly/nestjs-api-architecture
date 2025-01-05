import { Module } from '@nestjs/common';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
import { WebhookConfigModule } from '@infrastructure/integrations/webhook-client/config';
import { DynamicConfigModule } from '@shared/config';

@Module({
  imports: [WebhookConfigModule],
  ...DynamicConfigModule.forProviderRegister([{ useClass: WebhookIntegrationClientProviderImpl }])
})
export class WebhookIntegrationClientModule {}
