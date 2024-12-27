import { Module, Provider } from '@nestjs/common';
import { RepositoryInfraModule } from '@infrastructure/repositories';
import { AuthAppModule } from '@application/web/middleware/apikey';
import { OrdersController } from '@application/web/controllers/orders';
import { UsecaseProviderConfig } from '@application/config/usecases/abstract';
import { NotificationOrderRegisterUsecaseImpl } from '@core/usecases/notification/impl';
import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { SqsQueueInfraModule } from '@infrastructure/queue/sqs';
import { OrderCreationUseCaseImpl, OrderEndUsecaseImpl, OrderFindByIdUsecaseImpl, OrderQueryQuantityStatusUsecaseImpl, OrderQueryUsecaseImpl, OrderStartUsecaseImpl } from '@core/usecases/orders/impl';
import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';

const usecaseProvidersConfig: Provider[] = [
  UsecaseProviderConfig(OrderCreationUseCaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  UsecaseProviderConfig(OrderQueryUsecaseImpl, [OrderRepositoryProviderImpl]),
  UsecaseProviderConfig(OrderQueryQuantityStatusUsecaseImpl, [OrderRepositoryProviderImpl]),
  UsecaseProviderConfig(OrderFindByIdUsecaseImpl, [OrderRepositoryProviderImpl]),
  UsecaseProviderConfig(OrderEndUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  UsecaseProviderConfig(OrderStartUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  UsecaseProviderConfig(NotificationOrderRegisterUsecaseImpl, [SqsProducerQueueProviderImpl]),
];

@Module({
  imports: [RepositoryInfraModule, AuthAppModule, SqsQueueInfraModule],
  controllers: [OrdersController],
  providers: usecaseProvidersConfig,
})
export class OrdersAppModule {}
