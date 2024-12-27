import { OrderQueryCoreEntity, OrderPaginationCoreEntity } from '@core/domain/entities/orders';

export interface OrderQueryUsecase {
  execute(queryCore: OrderQueryCoreEntity): Promise<OrderPaginationCoreEntity>;
}
