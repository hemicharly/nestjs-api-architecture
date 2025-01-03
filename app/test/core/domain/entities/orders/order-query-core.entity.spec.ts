import { OrderStatus } from '@core/domain/enums';
import { OrderQuantityStatusEntity } from '@core/domain/entities/orders';

/**
 * Implementation of test to 'order-query-core.entity.ts'
 */
describe('order-query-core.entity.ts', () => {
  it('should correctly instantiate with valid values', () => {
    const count = 10;
    const year = 2024;
    const month = 7;
    const week = 31;
    const day = 15;
    const status = OrderStatus.FINISHED;

    const entity = new OrderQuantityStatusEntity(count, year, month, week, day, status);

    expect(entity.count).toBe(count);
    expect(entity.year).toBe(year);
    expect(entity.month).toBe(month);
    expect(entity.week).toBe(week);
    expect(entity.day).toBe(day);
    expect(entity.status).toBe(status);
  });
});
