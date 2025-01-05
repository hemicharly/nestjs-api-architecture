import { OrderStatus } from '@core/domain/enums';
import { OrderCoreEntity, OrderEndCoreEntity } from '@core/domain/entities/orders';
import { CustomBusinessException, CustomResourceNotFoundException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';

/**
 * Implementation of test to 'order-end-core.entity.ts'
 */
describe('order-end-core.entity.ts', () => {
  let orderEndCoreEntity: OrderEndCoreEntity;
  const employeeId = 'employee123';
  const orderId = 'order123';

  beforeEach(() => {
    orderEndCoreEntity = new OrderEndCoreEntity(orderId, employeeId);
  });

  it('should be created with the correct id, employeeId, and status', () => {
    expect(orderEndCoreEntity.id).toBe(orderId);
    expect(orderEndCoreEntity.employeeId).toBe(employeeId);
    expect(orderEndCoreEntity.status).toBe(OrderStatus.FINISHED);
  });

  describe('validateOrderEnd', () => {
    it('should throw CustomResourceNotFoundException if entityCore is null', () => {
      expect(() => {
        OrderEndCoreEntity.validateOrderEnd(null as unknown as OrderCoreEntity);
      }).toThrowError(CustomResourceNotFoundException);
      expect(() => {
        OrderEndCoreEntity.validateOrderEnd(null as unknown as OrderCoreEntity);
      }).toThrowError(new CustomResourceNotFoundException(CodeError.ORDER_NOT_FOUND));
    });

    it('should throw CustomBusinessException if the order status is not "IN_PROGRESS"', () => {
      const orderCoreEntity: OrderCoreEntity = {
        id: 'order123',
        employeeId: 'employee123',
        status: OrderStatus.FINISHED,
        schedulingDate: '',
        serviceDescription: '',
        createdAt: ''
      };

      expect(() => {
        OrderEndCoreEntity.validateOrderEnd(orderCoreEntity);
      }).toThrowError(CustomBusinessException);
      expect(() => {
        OrderEndCoreEntity.validateOrderEnd(orderCoreEntity);
      }).toThrowError(new CustomBusinessException(CodeError.ORDER_NOT_IN_PROGRESS));
    });

    it('should pass validation if the order status is "IN_PROGRESS"', () => {
      const orderCoreEntity: OrderCoreEntity = {
        id: 'order123',
        employeeId: 'employee123',
        status: OrderStatus.IN_PROGRESS,
        schedulingDate: '',
        serviceDescription: '',
        createdAt: ''
      };

      expect(() => {
        OrderEndCoreEntity.validateOrderEnd(orderCoreEntity);
      }).not.toThrow();
    });
  });
});
