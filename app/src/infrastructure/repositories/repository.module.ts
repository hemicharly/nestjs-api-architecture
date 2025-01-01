import { Module } from '@nestjs/common';
import { AuthRepositoryModule } from '@infrastructure/repositories/auth';
import { OrdersRepositoryModule } from '@infrastructure/repositories/orders';
import { DatabaseModule } from '@src/database.module';
import { DynamicConfigModule } from '@shared/config';

const dynamicModule = DynamicConfigModule.forModules([AuthRepositoryModule, OrdersRepositoryModule]);

@Module({
  imports: [DatabaseModule, ...dynamicModule.imports],
  exports: [...dynamicModule.exports],
})
export class RepositoryModule {}
