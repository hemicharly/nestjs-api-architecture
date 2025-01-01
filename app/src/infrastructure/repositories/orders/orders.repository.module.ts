import { Module } from '@nestjs/common';
import { OrderEntity } from '@infrastructure/repositories/orders/entity';
import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
import { DynamicConfigModule } from '@shared/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  ...DynamicConfigModule.forFeature([OrderRepositoryProviderImpl]),
})
export class OrdersRepositoryModule {}
