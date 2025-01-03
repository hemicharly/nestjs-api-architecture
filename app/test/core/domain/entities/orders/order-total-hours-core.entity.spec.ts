import { OrderCoreEntity, OrderTotalHoursCoreEntity } from '@core/domain/entities/orders';
import { OrderStatus } from '@core/domain/enums';

/**
 * Implementation of test to 'order-total-hours-core.entity.ts'
 */
describe('order-total-hours-core.entity.ts', () => {
  describe('constructor', () => {
    it('should initialize with 0 hours, 0 minutes, and 0 seconds', () => {
      const entity = new OrderTotalHoursCoreEntity();
      expect(entity.hours).toBe(0);
      expect(entity.minutes).toBe(0);
      expect(entity.seconds).toBe(0);
    });
  });

  describe('calculate', () => {
    it('should correctly calculate the time difference between two dates', () => {
      const startDatetime = '2024-12-29T08:00:00Z';
      const endDatetime = '2024-12-29T12:45:30Z';

      const result = OrderTotalHoursCoreEntity.calculate(startDatetime, endDatetime);

      expect(result.hours).toBe(4);
      expect(result.minutes).toBe(45);
      expect(result.seconds).toBe(30);
    });

    it('should throw an error if the date format is invalid', () => {
      const startDatetime = '2024-12-29T08:00:00Z';
      const endDatetime = 'invalid-date';

      expect(() => {
        OrderTotalHoursCoreEntity.calculate(startDatetime, endDatetime);
      }).toThrowError('Invalid date format');
    });

    it('should return 0 hours, 0 minutes, and 0 seconds if any date is missing', () => {
      const startDatetime = '';
      const endDatetime = '2024-12-29T12:45:30Z';

      const result = OrderTotalHoursCoreEntity.calculate(startDatetime, endDatetime);

      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    it('should correctly accumulate the total time from multiple OrderCoreEntity instances', () => {
      const order1: OrderCoreEntity = {
        createdAt: '',
        employeeId: '',
        id: '',
        schedulingDate: '',
        serviceDescription: '',
        status: OrderStatus.FINISHED,
        totalHours: { hours: 2, minutes: 30, seconds: 0 },
      };
      const order2: OrderCoreEntity = {
        createdAt: '',
        employeeId: '',
        id: '',
        schedulingDate: '',
        serviceDescription: '',
        status: OrderStatus.FINISHED,
        totalHours: { hours: 1, minutes: 15, seconds: 30 },
      };
      const order3: OrderCoreEntity = {
        createdAt: '',
        employeeId: '',
        id: '',
        schedulingDate: '',
        serviceDescription: '',
        status: OrderStatus.FINISHED,
        totalHours: { hours: 0, minutes: 45, seconds: 15 },
      };

      const items = [order1, order2, order3];

      const result = OrderTotalHoursCoreEntity.calculateTotal(items);

      expect(result.hours).toBe(4);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(45);
    });

    it('should return 0 hours, 0 minutes, and 0 seconds if the list is empty', () => {
      const result = OrderTotalHoursCoreEntity.calculateTotal([]);

      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });
  });

  describe('secondsToHoursMinutesSeconds', () => {
    it('should correctly convert seconds to hours, minutes, and seconds', () => {
      const totalSeconds = 5555; // 1 hour, 32 minutes, 35 seconds

      const result = Reflect.apply(OrderTotalHoursCoreEntity['secondsToHoursMinutesSeconds'], null, [totalSeconds]);

      expect(result.hours).toBe(1);
      expect(result.minutes).toBe(32);
      expect(result.seconds).toBe(35);
    });

    it('should throw an error if totalSeconds is negative', () => {
      const totalSeconds = -100;

      expect(() => {
        Reflect.apply(OrderTotalHoursCoreEntity['secondsToHoursMinutesSeconds'], null, [totalSeconds]);
      }).toThrowError('Invalid totalSeconds value. It must be a non-negative number.');
    });

    it('should throw an error if totalSeconds is NaN', () => {
      const totalSeconds = NaN;

      expect(() => {
        Reflect.apply(OrderTotalHoursCoreEntity['secondsToHoursMinutesSeconds'], null, [totalSeconds]);
      }).toThrowError('Invalid totalSeconds value. It must be a non-negative number.');
    });
  });
});
