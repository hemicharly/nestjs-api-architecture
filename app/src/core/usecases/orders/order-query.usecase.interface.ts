import { OrderQueryCoreEntity, OrderPaginationCoreEntity } from '@core/domain/entities/orders';

export interface OrderQueryUsecaseInterface {
  execute(queryCore: OrderQueryCoreEntity): Promise<OrderPaginationCoreEntity>;
}
