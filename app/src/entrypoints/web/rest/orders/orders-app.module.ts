import { Module } from '@nestjs/common';
import { RepositoryInfraModule } from '@infrastructure/repositories';
import { AuthAppModule } from '@entrypoints/web/shared/middleware/apikey';
import { OrdersController } from '@src/entrypoints/web/rest/orders';
import { NotificationOrderRegisterUsecaseImpl } from '@core/usecases/notification/impl';
import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { SqsQueueInfraModule } from '@infrastructure/queue/sqs';
import { OrderCreationUseCaseImpl, OrderEndUsecaseImpl, OrderFindByIdUsecaseImpl, OrderQueryQuantityStatusUsecaseImpl, OrderQueryUsecaseImpl, OrderStartUsecaseImpl } from '@core/usecases/orders/impl';
import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
import { DynamicConfigModule } from '@shared/config';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';
import { ConfigEnvModule } from '@infrastructure/config-env';

@Module({
  imports: [RepositoryInfraModule, AuthAppModule, SqsQueueInfraModule, ConfigEnvModule],
  controllers: [OrdersController],
  providers: [
    DynamicConfigModule.forProvider(OrderCreationUseCaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
    DynamicConfigModule.forProvider(OrderQueryUsecaseImpl, [OrderRepositoryProviderImpl]),
    DynamicConfigModule.forProvider(OrderQueryQuantityStatusUsecaseImpl, [OrderRepositoryProviderImpl]),
    DynamicConfigModule.forProvider(OrderFindByIdUsecaseImpl, [OrderRepositoryProviderImpl]),
    DynamicConfigModule.forProvider(OrderEndUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
    DynamicConfigModule.forProvider(OrderStartUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
    DynamicConfigModule.forProvider(NotificationOrderRegisterUsecaseImpl, [SqsProducerQueueProviderImpl, ConfigEnvProviderImpl]),
  ],
})
export class OrdersAppModule {}
