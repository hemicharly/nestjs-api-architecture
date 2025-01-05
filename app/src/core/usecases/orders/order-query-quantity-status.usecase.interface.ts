import {
  OrderQuantityStatusEntity,
  OrderQueryQuantityStatusCoreEntity
} from '@core/domain/entities/orders';

export interface OrderQueryQuantityStatusUsecaseInterface {
  execute(queryCore: OrderQueryQuantityStatusCoreEntity): Promise<OrderQuantityStatusEntity[]>;
}
