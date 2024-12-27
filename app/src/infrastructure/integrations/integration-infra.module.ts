import { Module } from '@nestjs/common';
import { WebhookIntegrationClientModule } from '@infrastructure/integrations/integration-client';
import { IntegrationInfraConfigModule } from '@infrastructure/integrations/abstract';

const integrationInfraConfigModule = IntegrationInfraConfigModule.forModules([WebhookIntegrationClientModule]);

@Module({
  imports: [...integrationInfraConfigModule.imports],
  exports: [...integrationInfraConfigModule.exports],
})
export class IntegrationInfraModule {}
