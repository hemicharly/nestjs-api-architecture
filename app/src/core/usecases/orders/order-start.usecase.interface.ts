import { OrderStartCoreEntity } from '@core/domain/entities/orders';

export interface OrderStartUsecaseInterface {
  execute(orderStartCoreEntity: OrderStartCoreEntity): Promise<void>;
}
