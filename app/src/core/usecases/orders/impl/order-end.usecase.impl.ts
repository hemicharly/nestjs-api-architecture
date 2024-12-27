import { OrderRepositoryProvider } from '@core/providers/repositories';
import { OrderCoordsCoreEntity, OrderEndCoreEntity } from '@core/domain/entities/orders';
import { ValidateDatesCoreEntity } from '@core/domain/entities/common';
import { OrderEndUsecase } from '@core/usecases/orders';
import { NotificationOrderRegisterUsecase } from '@core/usecases/notification';
import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';

export class OrderEndUsecaseImpl implements OrderEndUsecase {
  constructor(
    private readonly repositoryProvider: OrderRepositoryProvider,
    private readonly notificationOrderRegisterUsecase: NotificationOrderRegisterUsecase,
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
