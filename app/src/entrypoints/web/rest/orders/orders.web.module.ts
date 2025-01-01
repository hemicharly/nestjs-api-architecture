import { Module } from '@nestjs/common';
import { OrdersController } from '@src/entrypoints/web/rest/orders';
import { OrdersWebConfigModule } from '@shared/config/orders';
import { AuthAppModule } from '@shared/config/auth';

@Module({
  imports: [OrdersWebConfigModule, AuthAppModule],
  controllers: [OrdersController],
})
export class OrdersWebModule {}
