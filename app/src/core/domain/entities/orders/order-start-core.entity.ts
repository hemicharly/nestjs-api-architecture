import { OrderStatus } from '@core/domain/enums/order-status.enum';
import { OrderCoreEntity } from '@core/domain/entities/orders/order-core.entity';
import { CustomBusinessException, CustomResourceNotFoundException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';

export class OrderStartCoreEntity {
  startDatetime: string;
  recordedLatitude: string;
  recordedLongitude: string;
  readonly status: OrderStatus;

  constructor(
    readonly id: string,
    readonly employeeId: string,
  ) {
    this.id = id;
    this.employeeId = employeeId;
    this.status = OrderStatus.IN_PROGRESS;
  }

  public static validateOrderStart(entityCore: OrderCoreEntity): void {
    if (!entityCore) {
      throw new CustomResourceNotFoundException(CodeError.ORDER_NOT_FOUND);
    }

    if (entityCore.status !== OrderStatus.OPEN) {
      throw new CustomBusinessException(CodeError.ORDER_NOT_OPEN);
    }
  }
}
