import { Module } from '@nestjs/common';
import { WebhookIntegrationClientModule } from '@infrastructure/integrations/webhook-client';
import { DynamicConfigModule } from '@shared/config';

@Module({
  ...DynamicConfigModule.forModules([WebhookIntegrationClientModule])
})
export class IntegrationsModule {}
