import { OrderRepositoryProviderInterface } from '@core/providers/repositories';
import {
  OrderQuantityStatusEntity,
  OrderQueryQuantityStatusCoreEntity
} from '@core/domain/entities/orders';
import { ValidateDatesCoreEntity } from '@core/domain/entities/shared';
import { OrderQueryQuantityStatusUsecaseInterface } from '@core/usecases/orders';

export class OrderQueryQuantityStatusUsecaseImpl
  implements OrderQueryQuantityStatusUsecaseInterface
{
  constructor(private readonly repositoryProvider: OrderRepositoryProviderInterface) {}

  public async execute(
    queryCore: OrderQueryQuantityStatusCoreEntity
  ): Promise<OrderQuantityStatusEntity[]> {
    ValidateDatesCoreEntity.validateBetweenDates(queryCore.startDate, queryCore.endDate);
    return await this.repositoryProvider.countByEmployeeIdAndDateAndStatus(queryCore);
  }
}
