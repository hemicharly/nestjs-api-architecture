import { OrderRepositoryProvider } from '@core/providers/repositories';
import { OrderCoordsCoreEntity, OrderStartCoreEntity } from '@core/domain/entities/orders';
import { OrderStartUsecase } from '@core/usecases/orders';
import { NotificationOrderRegisterUsecase } from '@core/usecases/notification';
import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';

export class OrderStartUsecaseImpl implements OrderStartUsecase {
  constructor(
    private readonly repositoryProvider: OrderRepositoryProvider,
    private readonly notificationOrderRegisterUsecase: NotificationOrderRegisterUsecase,
  ) {}

  public async execute(orderStartCoreEntity: OrderStartCoreEntity): Promise<void> {
    OrderCoordsCoreEntity.validateCoordinates(orderStartCoreEntity.recordedLatitude, orderStartCoreEntity.recordedLongitude);

    const entityCore = await this.repositoryProvider.findByIdAndEmployeeId(orderStartCoreEntity.id, orderStartCoreEntity.employeeId);

    OrderStartCoreEntity.validateOrderStart(entityCore);

    OrderCoordsCoreEntity.validateDistance(entityCore.companyAddressLatitude, entityCore.companyAddressLongitude, orderStartCoreEntity.recordedLatitude, orderStartCoreEntity.recordedLongitude);

    await this.repositoryProvider.updateStart(orderStartCoreEntity.id, orderStartCoreEntity);

    const notificationOrderCoreEntity = NotificationOrderCoreEntity.fromOrderStartCoreEntity(orderStartCoreEntity, entityCore.companyName, 'A ordem foi iniciada.', entityCore.updatedAt);
    await this.notificationOrderRegisterUsecase.execute(notificationOrderCoreEntity);
  }
}
