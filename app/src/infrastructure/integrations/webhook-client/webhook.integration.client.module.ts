import { Module } from '@nestjs/common';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
import { IntegrationConfigModule } from '@infrastructure/integrations/config/abstract';
import { WebhookConfigModule } from '@infrastructure/integrations/webhook-client/config';

const integrationConfigModule = IntegrationConfigModule.forFeature(WebhookIntegrationClientProviderImpl);

@Module({
  imports: [WebhookConfigModule],
  providers: integrationConfigModule.providers,
  exports: integrationConfigModule.exports,
})
export class WebhookIntegrationClientModule {}
