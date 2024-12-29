import { OrderStatus, PeriodGroup } from '@core/domain/enums';

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
