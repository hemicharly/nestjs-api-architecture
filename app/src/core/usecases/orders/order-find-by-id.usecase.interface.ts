import { OrderCoreEntity, OrderFindByIdCoreEntity } from '@core/domain/entities/orders';

export interface OrderFindByIdUsecaseInterface {
  execute(orderFindByIdCoreEntity: OrderFindByIdCoreEntity): Promise<OrderCoreEntity>;
}
