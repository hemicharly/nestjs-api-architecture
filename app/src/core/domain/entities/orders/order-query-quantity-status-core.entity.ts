import { OrderStatus } from '@core/domain/enums/order-status.enum';
import { PeriodGroup } from '@core/domain/enums/period-group.enum';

export class OrderQueryQuantityStatusCoreEntity {
  status?: OrderStatus;

  constructor(
    readonly groupingPeriod: PeriodGroup,
    readonly startDate: string,
    readonly endDate: string,
    readonly employeeId: string,
  ) {
    this.groupingPeriod = groupingPeriod;
    this.startDate = startDate;
    this.endDate = endDate;
    this.employeeId = employeeId;
    this.status = null;
  }
}
