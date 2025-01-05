import { Module } from '@nestjs/common';
import { AuthRepositoryModule } from '@infrastructure/repositories/auth';
import { OrdersRepositoryModule } from '@infrastructure/repositories/orders';
import { DatabaseModule } from '@src/database.module';
import { DynamicConfigModule } from '@shared/config';

@Module({
  ...DynamicConfigModule.forModules([DatabaseModule, AuthRepositoryModule, OrdersRepositoryModule])
})
export class RepositoryModule {}
