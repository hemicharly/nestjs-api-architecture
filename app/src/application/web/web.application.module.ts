import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthAppModule } from '@application/web/controllers/health/health-app.module';
import { OrdersAppModule } from '@application/web/controllers/orders/orders-app.module';
import { LoggingMiddleware } from '@application/web/middleware/logger/logging-middleware';

@Module({
  imports: [HealthAppModule, OrdersAppModule],
})
export class WebApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
