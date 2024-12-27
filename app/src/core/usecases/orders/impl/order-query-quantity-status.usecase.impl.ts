import { OrderRepositoryProvider } from '@core/providers/repositories';
import { OrderQuantityStatusEntity, OrderQueryQuantityStatusCoreEntity } from '@core/domain/entities/orders';
import { ValidateDatesCoreEntity } from '@core/domain/entities/common';
import { OrderQueryQuantityStatusUsecase } from '@core/usecases/orders';

export class OrderQueryQuantityStatusUsecaseImpl implements OrderQueryQuantityStatusUsecase {
  constructor(private readonly repositoryProvider: OrderRepositoryProvider) {}

  public async execute(queryCore: OrderQueryQuantityStatusCoreEntity): Promise<OrderQuantityStatusEntity[]> {
    ValidateDatesCoreEntity.validateBetweenDates(queryCore.startDate, queryCore.endDate);
    return await this.repositoryProvider.countByEmployeeIdAndDateAndStatus(queryCore);
  }
}
