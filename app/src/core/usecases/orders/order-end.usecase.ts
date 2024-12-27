import { OrderEndCoreEntity } from '@core/domain/entities/orders';

export interface OrderEndUsecase {
  execute(orderEndCoreEntity: OrderEndCoreEntity): Promise<void>;
}
