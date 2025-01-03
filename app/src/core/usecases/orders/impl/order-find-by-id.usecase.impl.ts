import { OrderRepositoryProviderInterface } from '@core/providers/repositories';
import { CustomResourceNotFoundException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';
import { OrderCoreEntity, OrderFindByIdCoreEntity } from '@core/domain/entities/orders';
import { OrderFindByIdUsecaseInterface } from '@core/usecases/orders';

export class OrderFindByIdUsecaseImpl implements OrderFindByIdUsecaseInterface {
  constructor(private readonly repositoryProvider: OrderRepositoryProviderInterface) {}

  public async execute(orderFindByIdCoreEntity: OrderFindByIdCoreEntity): Promise<OrderCoreEntity> {
    const entityCore = await this.repositoryProvider.findByIdAndEmployeeId(orderFindByIdCoreEntity.id, orderFindByIdCoreEntity.employeeId);
    if (!entityCore) {
      throw new CustomResourceNotFoundException(CodeError.ORDER_NOT_FOUND);
    }
    return entityCore;
  }
}
