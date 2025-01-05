import { PaginationCoreEntity } from '@core/domain/entities/shared';
import {
  OrderCoreEntity,
  OrderPaginationCoreEntity,
  OrderTotalHoursCoreEntity
} from '@core/domain/entities/orders';
import { OrderStatus } from '@core/domain/enums';

/**
 * Implementation of test to 'order-pagination-core.entity.ts'
 */
describe('order-pagination-core.entity.ts', () => {
  it('should correctly instantiate with valid values and calculate total hours', () => {
    const pagination = new PaginationCoreEntity(1, 10);
    const orderCoreEntities: OrderCoreEntity[] = [
      {
        createdAt: '',
        employeeId: '',
        id: '',
        schedulingDate: '',
        serviceDescription: '',
        status: OrderStatus.FINISHED,
        totalHours: { hours: 2, minutes: 30, seconds: 0 }
      },
      {
        createdAt: '',
        employeeId: '',
        id: '',
        schedulingDate: '',
        serviceDescription: '',
        status: OrderStatus.FINISHED,
        totalHours: { hours: 1, minutes: 15, seconds: 0 }
      }
    ];

    const entity = new OrderPaginationCoreEntity(pagination, orderCoreEntities);

    expect(entity.pagination).toBe(pagination);
    expect(entity.orderCoreEntities).toBe(orderCoreEntities);
    expect(entity.totalHours).toBeInstanceOf(OrderTotalHoursCoreEntity);
    expect(entity.totalHours.hours).toBe(3); // 2h30m + 1h15m = 3h45m
    expect(entity.totalHours.minutes).toBe(45);
    expect(entity.totalHours.seconds).toBe(0);
  });
});
