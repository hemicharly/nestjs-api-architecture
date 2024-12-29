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
    this.count = count || 0;
    this.year = year || null;
    this.month = month || null;
    this.week = week || null;
    this.day = day || null;
    this.status = status || null;
  }
}
