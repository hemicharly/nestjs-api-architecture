import { Module } from '@nestjs/common';
import { OrdersController } from '@src/entrypoints/web/rest/orders';
import { OrdersWebConfigModule } from '@shared/config/orders';
import { AuthConfigModule } from '@shared/config/auth';

@Module({
  imports: [OrdersWebConfigModule, AuthConfigModule],
  controllers: [OrdersController],
})
export class OrdersWebModule {}
