import { OrderRepositoryProviderInterface } from '@core/providers/repositories';
import { OrderCoordsCoreEntity, OrderEndCoreEntity } from '@core/domain/entities/orders';
import { ValidateDatesCoreEntity } from '@core/domain/entities/shared';
import { OrderEndUsecaseInterface } from '@core/usecases/orders';
import { NotificationOrderRegisterUsecaseInterface } from '@core/usecases/notification';
import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';

export class OrderEndUsecaseImpl implements OrderEndUsecaseInterface {
  constructor(
    private readonly repositoryProvider: OrderRepositoryProviderInterface,
    private readonly notificationOrderRegisterUsecase: NotificationOrderRegisterUsecaseInterface,
  ) {}

  public async execute(orderEndCoreEntity: OrderEndCoreEntity): Promise<void> {
    OrderCoordsCoreEntity.validateCoordinates(orderEndCoreEntity.recordedLatitude, orderEndCoreEntity.recordedLongitude);

    const entityCore = await this.repositoryProvider.findByIdAndEmployeeId(orderEndCoreEntity.id, orderEndCoreEntity.employeeId);

    OrderEndCoreEntity.validateOrderEnd(entityCore);

    ValidateDatesCoreEntity.validateBetweenDates(entityCore.startDatetime, orderEndCoreEntity.endDatetime);

    OrderCoordsCoreEntity.validateDistance(entityCore.companyAddressLatitude, entityCore.companyAddressLongitude, orderEndCoreEntity.recordedLatitude, orderEndCoreEntity.recordedLongitude);

    await this.repositoryProvider.updateEnd(orderEndCoreEntity.id, orderEndCoreEntity);

    const notificationOrderCoreEntity = NotificationOrderCoreEntity.fromOrderEndCoreEntity(orderEndCoreEntity, entityCore, 'A ordem foi finalizada.', orderEndCoreEntity.endDatetime);
    await this.notificationOrderRegisterUsecase.execute(notificationOrderCoreEntity);
  }
}
