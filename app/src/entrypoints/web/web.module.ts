import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthWebModule } from '@entrypoints/web/rest/health';
import { OrdersWebModule } from '@entrypoints/web/rest/orders';
import { LoggingMiddleware } from '@entrypoints/web/shared/middleware/logger';
import { DynamicConfigModule } from '@shared/config';

@Module({
  ...DynamicConfigModule.forModules([HealthWebModule, OrdersWebModule]),
})
export class WebModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
