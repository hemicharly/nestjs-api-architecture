import { OrderRepositoryProviderInterface } from '@core/providers/repositories';
import { OrderPaginationCoreEntity, OrderQueryCoreEntity } from '@core/domain/entities/orders';
import { ValidateDatesCoreEntity } from '@core/domain/entities/shared';
import { OrderQueryUsecaseInterface } from '@core/usecases/orders';

export class OrderQueryUsecaseImpl implements OrderQueryUsecaseInterface {
  constructor(private readonly repositoryProvider: OrderRepositoryProviderInterface) {}

  public async execute(queryCore: OrderQueryCoreEntity): Promise<OrderPaginationCoreEntity> {
    if (queryCore.startDate && queryCore.endDate) {
      ValidateDatesCoreEntity.validateBetweenDates(queryCore.startDate, queryCore.endDate);
    }
    return await this.repositoryProvider.find(queryCore);
  }
}
