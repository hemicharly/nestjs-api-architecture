import { Module } from '@nestjs/common';
import { ConfigEnvModule } from '@infrastructure/config-env';
import { QueueInfraModule } from '@infrastructure/queue';
import { RepositoryModule } from '@infrastructure/repositories';
import { DynamicConfigModule } from '@shared/config';
import { IntegrationsModule } from '@infrastructure/integrations';

@Module({
  ...DynamicConfigModule.forModules([
    ConfigEnvModule,
    IntegrationsModule,
    QueueInfraModule,
    RepositoryModule
  ])
})
export class InfrastructureModule {}
