import { OrderQuantityStatusEntity, OrderQueryQuantityStatusCoreEntity } from '@core/domain/entities/orders';

export interface OrderQueryQuantityStatusUsecase {
  execute(queryCore: OrderQueryQuantityStatusCoreEntity): Promise<OrderQuantityStatusEntity[]>;
}
