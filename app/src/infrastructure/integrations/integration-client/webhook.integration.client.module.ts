import { Module } from '@nestjs/common';
import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/integration-client/impl';
import { IntegrationConfigModule } from '@infrastructure/integrations/abstract';
import { WebhookConfigModule } from '@infrastructure/integrations/integration-client/config';

const integrationConfigModule = IntegrationConfigModule.forFeature(WebhookIntegrationClientProviderImpl);

@Module({
  imports: [WebhookConfigModule],
  providers: integrationConfigModule.providers,
  exports: integrationConfigModule.exports,
})
export class WebhookIntegrationClientModule {}
