import { OrderStatus } from '@core/domain/enums';

import { OrderCoreEntity, OrderStartCoreEntity } from '@core/domain/entities/orders';
import { CustomBusinessException, CustomResourceNotFoundException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';

/**
 * Implementation of test to 'order-start-core.entity.ts'
 */
describe('order-start-core.entity.ts', () => {
  let orderStartCoreEntity: OrderStartCoreEntity;
  const employeeId = 'employee123';
  const orderId = 'order123';

  beforeEach(() => {
    orderStartCoreEntity = new OrderStartCoreEntity(orderId, employeeId);
  });

  it('should be created with the correct id, employeeId, and status', () => {
    expect(orderStartCoreEntity.id).toBe(orderId);
    expect(orderStartCoreEntity.employeeId).toBe(employeeId);
    expect(orderStartCoreEntity.status).toBe(OrderStatus.IN_PROGRESS);
  });

  describe('validateOrderStart', () => {
    it('should throw CustomResourceNotFoundException if entityCore is null', () => {
      expect(() => {
        OrderStartCoreEntity.validateOrderStart(null as unknown as OrderCoreEntity);
      }).toThrowError(CustomResourceNotFoundException);
      expect(() => {
        OrderStartCoreEntity.validateOrderStart(null as unknown as OrderCoreEntity);
      }).toThrowError(new CustomResourceNotFoundException(CodeError.ORDER_NOT_FOUND));
    });

    it('should throw CustomBusinessException if the order status is not "OPEN"', () => {
      const orderCoreEntity: OrderCoreEntity = {
        id: 'order123',
        employeeId: 'employee123',
        status: OrderStatus.FINISHED,
        schedulingDate: '',
        serviceDescription: '',
        createdAt: '',
      };

      expect(() => {
        OrderStartCoreEntity.validateOrderStart(orderCoreEntity);
      }).toThrowError(CustomBusinessException);
      expect(() => {
        OrderStartCoreEntity.validateOrderStart(orderCoreEntity);
      }).toThrowError(new CustomBusinessException(CodeError.ORDER_NOT_OPEN));
    });

    it('should pass validation if the order status is "OPEN"', () => {
      const orderCoreEntity: OrderCoreEntity = {
        id: 'order123',
        employeeId: 'employee123',
        status: OrderStatus.OPEN,
        schedulingDate: '',
        serviceDescription: '',
        createdAt: '',
      };

      expect(() => {
        OrderStartCoreEntity.validateOrderStart(orderCoreEntity);
      }).not.toThrow();
    });
  });
});
