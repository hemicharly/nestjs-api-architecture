import { OrderCoreEntity, OrderFindByIdCoreEntity } from '@core/domain/entities/orders';

export interface OrderFindByIdUsecase {
  execute(orderFindByIdCoreEntity: OrderFindByIdCoreEntity): Promise<OrderCoreEntity>;
}
