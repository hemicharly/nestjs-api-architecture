import { OrderStatus } from '@core/domain/enums';
import { OrderCoreEntity, OrderCreationCoreEntity } from '@core/domain/entities/orders';

/**
 * Implementation of test to 'order-creation-core.entity.ts'
 */
describe('order-creation-core.entity.ts', () => {
  let orderCreationCoreEntity: OrderCreationCoreEntity;

  beforeEach(() => {
    orderCreationCoreEntity = new OrderCreationCoreEntity('employee123');
  });

  it('should be created with the correct employeeId and status', () => {
    expect(orderCreationCoreEntity.employeeId).toBe('employee123');
    expect(orderCreationCoreEntity.status).toBe(OrderStatus.OPEN);
  });

  it('should correctly map the properties to an OrderCoreEntity', () => {
    // Adicionar propriedades ao OrderCreationCoreEntity
    orderCreationCoreEntity.serviceDescription = 'Test Service';
    orderCreationCoreEntity.companyName = 'Test Company';
    orderCreationCoreEntity.companyAddressLatitude = '40.7128';
    orderCreationCoreEntity.companyAddressLongitude = '-74.0060';
    orderCreationCoreEntity.schedulingDate = '2025-01-01';

    // Mapeia a entidade para OrderCoreEntity
    const mappedOrder: Partial<OrderCoreEntity> =
      OrderCreationCoreEntity.toOrderCoreEntity(orderCreationCoreEntity);

    // Verificar se as propriedades foram mapeadas corretamente
    expect(mappedOrder.employeeId).toBe('employee123');
    expect(mappedOrder.serviceDescription).toBe('Test Service');
    expect(mappedOrder.companyName).toBe('Test Company');
    expect(mappedOrder.companyAddressLatitude).toBe('40.7128');
    expect(mappedOrder.companyAddressLongitude).toBe('-74.0060');
    expect(mappedOrder.schedulingDate).toBe('2025-01-01');
    expect(mappedOrder.status).toBe(OrderStatus.OPEN);
  });
});
