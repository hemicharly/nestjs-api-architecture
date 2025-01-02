import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@src/infrastructure';
import { DynamicConfigModule } from '@shared/config';
import { OrderCreationUseCaseImpl, OrderEndUsecaseImpl, OrderFindByIdUsecaseImpl, OrderQueryQuantityStatusUsecaseImpl, OrderQueryUsecaseImpl, OrderStartUsecaseImpl } from '@core/usecases/orders/impl';
import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
import { NotificationOrderRegisterUsecaseImpl } from '@core/usecases/notification/impl';
import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';

@Module({
  imports: [InfrastructureModule],
  ...DynamicConfigModule.forProviderRegister([
    { useClass: OrderCreationUseCaseImpl, injects: [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl] },
    { useClass: OrderQueryUsecaseImpl, injects: [OrderRepositoryProviderImpl] },
    { useClass: OrderQueryQuantityStatusUsecaseImpl, injects: [OrderRepositoryProviderImpl] },
    { useClass: OrderFindByIdUsecaseImpl, injects: [OrderRepositoryProviderImpl] },
    { useClass: OrderEndUsecaseImpl, injects: [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl] },
    { useClass: OrderStartUsecaseImpl, injects: [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl] },
    { useClass: NotificationOrderRegisterUsecaseImpl, injects: [SqsProducerQueueProviderImpl, ConfigEnvProviderImpl] },
  ]),
})
export class OrdersWebConfigModule {}
