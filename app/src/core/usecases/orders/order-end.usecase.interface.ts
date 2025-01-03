import { OrderEndCoreEntity } from '@core/domain/entities/orders';

export interface OrderEndUsecaseInterface {
  execute(orderEndCoreEntity: OrderEndCoreEntity): Promise<void>;
}
