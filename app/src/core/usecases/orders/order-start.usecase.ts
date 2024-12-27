import { OrderStartCoreEntity } from '@core/domain/entities/orders';

export interface OrderStartUsecase {
  execute(orderStartCoreEntity: OrderStartCoreEntity): Promise<void>;
}
