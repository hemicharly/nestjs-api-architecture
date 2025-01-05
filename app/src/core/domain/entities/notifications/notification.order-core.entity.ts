import {
  OrderCoreEntity,
  OrderEndCoreEntity,
  OrderStartCoreEntity,
  OrderTotalHoursCoreEntity
} from '@core/domain/entities/orders';

export class NotificationOrderCoreEntity {
  readonly orderId: string;
  readonly employeeId: string;
  readonly companyName: string;
  readonly status: string;
  readonly message: string;
  readonly updatedAt: string;
  readonly totalHours?: OrderTotalHoursCoreEntity;

  public static fromOrderCoreEntity(
    entityCore: OrderCoreEntity,
    message: string,
    updatedAt: string
  ): Partial<NotificationOrderCoreEntity> {
    return {
      orderId: entityCore.id,
      employeeId: entityCore.employeeId,
      companyName: entityCore.companyName,
      status: entityCore.status,
      message: message,
      updatedAt: updatedAt
    };
  }

  public static fromOrderStartCoreEntity(
    entityCore: OrderStartCoreEntity,
    companyName: string,
    message: string,
    updatedAt: string
  ): Partial<NotificationOrderCoreEntity> {
    return {
      orderId: entityCore.id,
      employeeId: entityCore.employeeId,
      companyName: companyName,
      status: entityCore.status,
      message: message,
      updatedAt: updatedAt
    };
  }

  public static fromOrderEndCoreEntity(
    entityCore: OrderEndCoreEntity,
    orderCoreEntity: OrderCoreEntity,
    message: string,
    updatedAt: string
  ): Partial<NotificationOrderCoreEntity> {
    return {
      orderId: entityCore.id,
      employeeId: entityCore.employeeId,
      companyName: orderCoreEntity.companyName,
      status: entityCore.status,
      message: `${message} ${entityCore?.endComment || ''}`,
      totalHours: OrderTotalHoursCoreEntity.calculate(
        orderCoreEntity.startDatetime,
        entityCore.endDatetime
      ),
      updatedAt: updatedAt
    };
  }
}
