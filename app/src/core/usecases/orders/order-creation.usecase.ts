import { OrderCoreEntity, OrderCreationCoreEntity } from '@core/domain/entities/orders';

export interface OrderCreationUseCase {
  execute(entityCore: OrderCreationCoreEntity): Promise<OrderCoreEntity>;
}
