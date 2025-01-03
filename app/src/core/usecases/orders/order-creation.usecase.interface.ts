import { OrderCoreEntity, OrderCreationCoreEntity } from '@core/domain/entities/orders';

export interface OrderCreationUsecaseInterface {
  execute(entityCore: OrderCreationCoreEntity): Promise<OrderCoreEntity>;
}
