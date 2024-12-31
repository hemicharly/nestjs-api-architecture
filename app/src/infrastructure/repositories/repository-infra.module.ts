import { Module } from '@nestjs/common';
import { AuthInfraModule } from '@infrastructure/repositories/auth';
import { OrdersInfraModule } from '@infrastructure/repositories/orders';
import { DatabaseModule } from '@src/database.module';
import { DynamicConfigModule } from '@shared/config/abstract';

const dynamicModule = DynamicConfigModule.forModules([AuthInfraModule, OrdersInfraModule]);

@Module({
  imports: [DatabaseModule, ...dynamicModule.imports],
  exports: dynamicModule.exports,
})
export class RepositoryInfraModule {}
