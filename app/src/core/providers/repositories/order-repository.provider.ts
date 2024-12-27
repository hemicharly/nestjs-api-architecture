import {
  OrderCoreEntity,
  OrderEndCoreEntity,
  OrderPaginationCoreEntity,
  OrderQuantityStatusEntity,
  OrderQueryCoreEntity,
  OrderQueryQuantityStatusCoreEntity,
  OrderStartCoreEntity,
} from '@core/domain/entities/orders';

export interface OrderRepositoryProvider {
  save(entityCore: Partial<OrderCoreEntity>): Promise<OrderCoreEntity>;

  updateStart(id: string, entityCore: OrderStartCoreEntity): Promise<void>;

  updateEnd(id: string, entityCore: OrderEndCoreEntity): Promise<void>;

  findByIdAndEmployeeId(id: string, employeeId: string): Promise<OrderCoreEntity>;

  find(queryCore: OrderQueryCoreEntity): Promise<OrderPaginationCoreEntity>;

  countByEmployeeIdAndDateAndStatus(queryCore: OrderQueryQuantityStatusCoreEntity): Promise<OrderQuantityStatusEntity[]>;
}
