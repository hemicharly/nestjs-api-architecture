import { OrderTotalHoursCoreEntity, OrderCoreEntity } from '@core/domain/entities/orders';
import { GenericPaginationCoreEntity, PaginationCoreEntity } from '@core/domain/entities/common';

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
