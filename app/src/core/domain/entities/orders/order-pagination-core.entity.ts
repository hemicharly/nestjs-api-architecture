import { OrderTotalHoursCoreEntity } from '@core/domain/entities/orders/order-total-hours-core.entity';
import { GenericPaginationCoreEntity } from '@core/domain/entities/common/generic-pagination-core.entity';
import { OrderCoreEntity } from '@core/domain/entities/orders/order-core.entity';
import { PaginationCoreEntity } from '@core/domain/entities/common/pagination-core.entity';

export class OrderPaginationCoreEntity extends GenericPaginationCoreEntity<OrderCoreEntity> {
  readonly totalHours: OrderTotalHoursCoreEntity;

  constructor(
    readonly pagination: PaginationCoreEntity,
    readonly orderCoreEntities: OrderCoreEntity[],
  ) {
    super(pagination, orderCoreEntities);
    this.totalHours = OrderTotalHoursCoreEntity.calculateTotal(orderCoreEntities);
  }
}
