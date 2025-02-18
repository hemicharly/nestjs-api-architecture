import { OrderStatus } from '@core/domain/enums';
import { OrderTotalHoursCoreEntity } from '@core/domain/entities/orders';

export class OrderCoreEntity {
  id: string;
  employeeId: string;
  serviceDescription: string;
  companyName?: string;
  companyAddressLatitude?: string;
  companyAddressLongitude?: string;
  schedulingDate: string;
  endComment?: string;
  recordedLatitude?: string;
  recordedLongitude?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  readonly totalHours?: OrderTotalHoursCoreEntity;

  constructor(
    readonly startDatetime?: string,
    readonly endDatetime?: string
  ) {
    this.totalHours = OrderTotalHoursCoreEntity.calculate(startDatetime, endDatetime);
    this.startDatetime = startDatetime || null;
    this.endDatetime = endDatetime || null;
  }
}
