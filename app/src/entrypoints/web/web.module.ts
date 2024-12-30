import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthAppModule } from '@src/entrypoints/web/rest/health/health-app.module';
import { OrdersAppModule } from '@src/entrypoints/web/rest/orders/orders-app.module';
import { LoggingMiddleware } from '@entrypoints/web/shared/middleware/logger/logging.middleware';

@Module({
  imports: [HealthAppModule, OrdersAppModule],
})
export class WebModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
