import { OrderStatus } from '@core/domain/enums';

export class OrderQuantityStatusEntity {
  constructor(
    readonly count: number,
    readonly year: number,
    readonly month: number,
    readonly week: number,
    readonly day: number,
    readonly status: OrderStatus,
  ) {
    this.count = count;
    this.year = year;
    this.month = month;
    this.week = week;
    this.day = day;
    this.status = status;
  }
}
