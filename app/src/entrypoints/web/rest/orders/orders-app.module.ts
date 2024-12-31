import { Module, Provider } from '@nestjs/common';
import { RepositoryInfraModule } from '@infrastructure/repositories';
import { AuthAppModule } from '@entrypoints/web/shared/middleware/apikey';
import { OrdersController } from '@src/entrypoints/web/rest/orders';
import { NotificationOrderRegisterUsecaseImpl } from '@core/usecases/notification/impl';
import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { SqsQueueInfraModule } from '@infrastructure/queue/sqs';
import { OrderCreationUseCaseImpl, OrderEndUsecaseImpl, OrderFindByIdUsecaseImpl, OrderQueryQuantityStatusUsecaseImpl, OrderQueryUsecaseImpl, OrderStartUsecaseImpl } from '@core/usecases/orders/impl';
import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
import { UsecaseProviderConfig } from '@shared/config/abstract';
import { ConfigEnvProvider } from '@core/providers/config-env';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';
import { ConfigEnvModule } from '@infrastructure/config-env';

const usecaseProvidersConfig: Provider[] = [
  UsecaseProviderConfig(OrderCreationUseCaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  UsecaseProviderConfig(OrderQueryUsecaseImpl, [OrderRepositoryProviderImpl]),
  UsecaseProviderConfig(OrderQueryQuantityStatusUsecaseImpl, [OrderRepositoryProviderImpl]),
  UsecaseProviderConfig(OrderFindByIdUsecaseImpl, [OrderRepositoryProviderImpl]),
  UsecaseProviderConfig(OrderEndUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  UsecaseProviderConfig(OrderStartUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
  UsecaseProviderConfig(NotificationOrderRegisterUsecaseImpl, [SqsProducerQueueProviderImpl, ConfigEnvProviderImpl]),
];

@Module({
  imports: [RepositoryInfraModule, AuthAppModule, SqsQueueInfraModule, ConfigEnvModule],
  controllers: [OrdersController],
  providers: usecaseProvidersConfig,
})
export class OrdersAppModule {}
