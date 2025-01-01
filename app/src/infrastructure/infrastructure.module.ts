import { Module } from '@nestjs/common';
import { ConfigEnvModule } from '@infrastructure/config-env';
import { QueueInfraModule } from '@infrastructure/queue';
import { RepositoryModule } from '@infrastructure/repositories';
import { DynamicConfigModule } from '@shared/config';

@Module({
  ...DynamicConfigModule.forModules([ConfigEnvModule, QueueInfraModule, RepositoryModule]),
})
export class InfrastructureModule {}
