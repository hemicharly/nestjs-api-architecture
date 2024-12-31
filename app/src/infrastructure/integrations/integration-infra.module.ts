import { Module } from '@nestjs/common';
import { WebhookIntegrationClientModule } from '@infrastructure/integrations/webhook-client';
import { DynamicConfigModule } from '@shared/config/abstract';

const dynamicModule = DynamicConfigModule.forModules([WebhookIntegrationClientModule]);

@Module({
  imports: [...dynamicModule.imports],
  exports: [...dynamicModule.exports],
})
export class IntegrationInfraModule {}
