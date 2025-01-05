import { OrderRepositoryProviderInterface } from '@core/providers/repositories';
import { OrderCoordsCoreEntity, OrderStartCoreEntity } from '@core/domain/entities/orders';
import { OrderStartUsecaseInterface } from '@core/usecases/orders';
import { NotificationOrderRegisterUsecaseInterface } from '@core/usecases/notification';
import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';

export class OrderStartUsecaseImpl implements OrderStartUsecaseInterface {
  constructor(
    private readonly repositoryProvider: OrderRepositoryProviderInterface,
    private readonly notificationOrderRegisterUsecase: NotificationOrderRegisterUsecaseInterface
  ) {}

  public async execute(orderStartCoreEntity: OrderStartCoreEntity): Promise<void> {
    OrderCoordsCoreEntity.validateCoordinates(
      orderStartCoreEntity.recordedLatitude,
      orderStartCoreEntity.recordedLongitude
    );

    const entityCore = await this.repositoryProvider.findByIdAndEmployeeId(
      orderStartCoreEntity.id,
      orderStartCoreEntity.employeeId
    );

    OrderStartCoreEntity.validateOrderStart(entityCore);

    OrderCoordsCoreEntity.validateDistance(
      entityCore.companyAddressLatitude,
      entityCore.companyAddressLongitude,
      orderStartCoreEntity.recordedLatitude,
      orderStartCoreEntity.recordedLongitude
    );

    await this.repositoryProvider.updateStart(orderStartCoreEntity.id, orderStartCoreEntity);

    const notificationOrderCoreEntity = NotificationOrderCoreEntity.fromOrderStartCoreEntity(
      orderStartCoreEntity,
      entityCore.companyName,
      'A ordem foi iniciada.',
      orderStartCoreEntity.startDatetime
    );
    await this.notificationOrderRegisterUsecase.execute(notificationOrderCoreEntity);
  }
}
