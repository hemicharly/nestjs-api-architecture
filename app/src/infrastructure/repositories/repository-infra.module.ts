import { Module } from '@nestjs/common';
import { AuthInfraModule } from '@infrastructure/repositories/auth';
import { OrdersInfraModule } from '@infrastructure/repositories/orders';
import { DatabaseModule } from '@src/database.module';
import { RepositoryInfraConfigModule } from '@infrastructure/repositories/abstract/repository.infra.config.module';

const repositoryInfraConfigModule = RepositoryInfraConfigModule.forModules([AuthInfraModule, OrdersInfraModule]);

@Module({
  imports: [DatabaseModule, ...repositoryInfraConfigModule.imports],
  exports: [...repositoryInfraConfigModule.exports],
})
export class RepositoryInfraModule {}
