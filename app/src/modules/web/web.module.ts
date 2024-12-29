import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthAppModule } from '@src/modules/web/rest/health/health-app.module';
import { OrdersAppModule } from '@src/modules/web/rest/orders/orders-app.module';
import { LoggingMiddleware } from '@application/web/shared/middleware/logger/logging.middleware';

@Module({
  imports: [HealthAppModule, OrdersAppModule],
})
export class WebModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
