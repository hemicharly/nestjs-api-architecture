import { Module } from '@nestjs/common';
import { WebhookIntegrationClientModule } from 'src/infrastructure/integrations/webhook-client';
import { IntegrationInfraConfigModule } from 'src/infrastructure/integrations/config/abstract';

const integrationInfraConfigModule = IntegrationInfraConfigModule.forModules([WebhookIntegrationClientModule]);

@Module({
  imports: [...integrationInfraConfigModule.imports],
  exports: [...integrationInfraConfigModule.exports],
})
export class IntegrationInfraModule {}
