import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@src/infrastructure';
import { DynamicConfigModule } from '@shared/config';
import { OrderCreationUseCaseImpl, OrderEndUsecaseImpl, OrderFindByIdUsecaseImpl, OrderQueryQuantityStatusUsecaseImpl, OrderQueryUsecaseImpl, OrderStartUsecaseImpl } from '@core/usecases/orders/impl';
import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
import { NotificationOrderRegisterUsecaseImpl } from '@core/usecases/notification/impl';
import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';

const dynamicProvider = [
  DynamicConfigModule.forProvider(OrderCreationUseCaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  DynamicConfigModule.forProvider(OrderQueryUsecaseImpl, [OrderRepositoryProviderImpl]),
  DynamicConfigModule.forProvider(OrderQueryQuantityStatusUsecaseImpl, [OrderRepositoryProviderImpl]),
  DynamicConfigModule.forProvider(OrderFindByIdUsecaseImpl, [OrderRepositoryProviderImpl]),
  DynamicConfigModule.forProvider(OrderEndUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  DynamicConfigModule.forProvider(OrderStartUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  DynamicConfigModule.forProvider(NotificationOrderRegisterUsecaseImpl, [SqsProducerQueueProviderImpl, ConfigEnvProviderImpl]),
];

@Module({
  imports: [InfrastructureModule],
  providers: dynamicProvider,
  exports: dynamicProvider,
})
export class OrdersWebConfigModule {}
