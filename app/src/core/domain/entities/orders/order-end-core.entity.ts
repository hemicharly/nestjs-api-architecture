import { OrderStatus } from '@core/domain/enums/order-status.enum';
import { OrderCoreEntity } from '@core/domain/entities/orders/order-core.entity';
import { CustomBusinessException, CustomResourceNotFoundException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';

export class OrderEndCoreEntity {
  endDatetime: string;
  endComment?: string;
  recordedLatitude: string;
  recordedLongitude: string;
  readonly status: OrderStatus;

  constructor(
    readonly id: string,
    readonly employeeId: string,
  ) {
    this.id = id;
    this.employeeId = employeeId;
    this.status = OrderStatus.FINISHED;
  }

  public static validateOrderEnd(entityCore: OrderCoreEntity): void {
    if (!entityCore) {
      throw new CustomResourceNotFoundException(CodeError.ORDER_NOT_FOUND);
    }

    if (entityCore.status !== OrderStatus.IN_PROGRESS) {
      throw new CustomBusinessException(CodeError.ORDER_NOT_IN_PROGRESS);
    }
  }
}
