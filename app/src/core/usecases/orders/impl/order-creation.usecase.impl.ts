import { OrderCreationCoreEntity, OrderCoreEntity, OrderCoordsCoreEntity } from '@core/domain/entities/orders';
import { OrderCreationUseCase } from '@core/usecases/orders';
import { OrderRepositoryProvider } from '@core/providers/repositories';
import { NotificationOrderRegisterUsecase } from '@core/usecases/notification';
import { NotificationOrderCoreEntity } from 'src/core/domain/entities/notifications';

export class OrderCreationUseCaseImpl implements OrderCreationUseCase {
  constructor(
    private readonly repositoryProvider: OrderRepositoryProvider,
    private readonly notificationOrderRegisterUsecase: NotificationOrderRegisterUsecase,
  ) {}

  public async execute(entityCore: OrderCreationCoreEntity): Promise<OrderCoreEntity> {
    OrderCoordsCoreEntity.validateCoordinates(entityCore.companyAddressLatitude, entityCore.companyAddressLongitude);
    const orderCoreEntity = OrderCreationCoreEntity.toOrderCoreEntity(entityCore);
    const orderCoreEntitySaved = await this.repositoryProvider.save(orderCoreEntity);

    const notificationOrderCoreEntity = NotificationOrderCoreEntity.fromOrderCoreEntity(orderCoreEntitySaved, 'Uma nova ordem foi criada.', orderCoreEntitySaved.updatedAt);

    await this.notificationOrderRegisterUsecase.execute(notificationOrderCoreEntity);

    return orderCoreEntitySaved;
  }
}
