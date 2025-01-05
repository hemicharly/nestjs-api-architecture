import {
  OrderCreationCoreEntity,
  OrderCoreEntity,
  OrderCoordsCoreEntity
} from '@core/domain/entities/orders';
import { OrderCreationUsecaseInterface } from '@core/usecases/orders';
import { OrderRepositoryProviderInterface } from '@core/providers/repositories';
import { NotificationOrderRegisterUsecaseInterface } from '@core/usecases/notification';
import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';

export class OrderCreationUseCaseImpl implements OrderCreationUsecaseInterface {
  constructor(
    private readonly repositoryProvider: OrderRepositoryProviderInterface,
    private readonly notificationOrderRegisterUsecase: NotificationOrderRegisterUsecaseInterface
  ) {}

  public async execute(entityCore: OrderCreationCoreEntity): Promise<OrderCoreEntity> {
    OrderCoordsCoreEntity.validateCoordinates(
      entityCore.companyAddressLatitude,
      entityCore.companyAddressLongitude
    );
    const orderCoreEntity = OrderCreationCoreEntity.toOrderCoreEntity(entityCore);
    const orderCoreEntitySaved = await this.repositoryProvider.save(orderCoreEntity);

    const notificationOrderCoreEntity = NotificationOrderCoreEntity.fromOrderCoreEntity(
      orderCoreEntitySaved,
      'Uma nova ordem foi criada.',
      orderCoreEntitySaved.createdAt
    );

    await this.notificationOrderRegisterUsecase.execute(notificationOrderCoreEntity);

    return orderCoreEntitySaved;
  }
}
