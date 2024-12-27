import { OrderRepositoryProvider } from '@core/providers/repositories';
import { OrderPaginationCoreEntity, OrderQueryCoreEntity } from '@core/domain/entities/orders';
import { ValidateDatesCoreEntity } from '@core/domain/entities/common';
import { OrderQueryUsecase } from '@core/usecases/orders';

export class OrderQueryUsecaseImpl implements OrderQueryUsecase {
  constructor(private readonly repositoryProvider: OrderRepositoryProvider) {}

  public async execute(queryCore: OrderQueryCoreEntity): Promise<OrderPaginationCoreEntity> {
    if (queryCore.startDate && queryCore.endDate) {
      ValidateDatesCoreEntity.validateBetweenDates(queryCore.startDate, queryCore.endDate);
    }
    return await this.repositoryProvider.find(queryCore);
  }
}
