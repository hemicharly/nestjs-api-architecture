import { PaginationCoreEntity } from '@core/domain/entities/shared';
import { OrderStatus } from '@core/domain/enums';

export class OrderQueryCoreEntity {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;

  constructor(
    readonly pagination: PaginationCoreEntity,
    readonly employeeId: string
  ) {
    this.pagination = pagination;
    this.employeeId = employeeId;
    this.status = null;
    this.startDate = null;
    this.endDate = null;
  }
}
