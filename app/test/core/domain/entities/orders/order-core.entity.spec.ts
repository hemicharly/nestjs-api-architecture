import { OrderCoreEntity } from '@core/domain/entities/orders';
import { OrderStatus } from '@core/domain/enums';

/**
 * Implementation of test for 'order-core.entity.ts'
 */
describe('order-core.entity.ts', () => {
  it('should correctly create an instance of the class', () => {
    const order = new OrderCoreEntity('2025-01-01T08:00:00', '2025-01-01T13:00:00');

    expect(order).toBeInstanceOf(OrderCoreEntity);
    expect(order.startDatetime).toBe('2025-01-01T08:00:00');
    expect(order.endDatetime).toBe('2025-01-01T13:00:00');
    expect(order.totalHours.hours).toBe(5);
  });

  it('should handle missing optional data correctly', () => {
    const order = new OrderCoreEntity('2025-01-01T08:00:00', '2025-01-01T13:00:00');

    expect(order.companyName).toBeUndefined();
    expect(order.companyAddressLatitude).toBeUndefined();
    expect(order.companyAddressLongitude).toBeUndefined();
    expect(order.endComment).toBeUndefined();
    expect(order.recordedLatitude).toBeUndefined();
    expect(order.recordedLongitude).toBeUndefined();
    expect(order.updatedAt).toBeUndefined();
  });

  it('should set the status correctly', () => {
    const order = new OrderCoreEntity('2025-01-01T08:00:00', '2025-01-01T13:00:00');
    order.status = OrderStatus.IN_PROGRESS;

    expect(order.status).toBe(OrderStatus.IN_PROGRESS);
  });

  it('should handle optional values in the constructor', () => {
    const order = new OrderCoreEntity();

    expect(order.startDatetime).toBeNull();
    expect(order.endDatetime).toBeNull();
  });

  it('should assign values correctly in the constructor with optional data', () => {
    const order = new OrderCoreEntity('2025-01-01T08:00:00', '2025-01-01T13:00:00');
    order.companyName = 'My Company';
    order.companyAddressLatitude = '123.456';
    order.companyAddressLongitude = '789.012';
    order.endComment = 'End comment here';

    expect(order.companyName).toBe('My Company');
    expect(order.companyAddressLatitude).toBe('123.456');
    expect(order.companyAddressLongitude).toBe('789.012');
    expect(order.endComment).toBe('End comment here');
  });
});
