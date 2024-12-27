import { Request } from 'express';
import { OrderQuantityStatusResponse } from '@application/web/response/orders';
import { OrderQueryQuantityStatusRequest } from '@application/web/request/orders';
import { OrderQuantityStatusEntity, OrderQueryQuantityStatusCoreEntity } from '@core/domain/entities/orders';
import { PeriodGroup } from '@core/domain/enums';

export class OrderQueryQuantityStatusAppMapper {
  public static fromApi(object: OrderQueryQuantityStatusRequest, { userId }: Request): OrderQueryQuantityStatusCoreEntity {
    const entityCore = new OrderQueryQuantityStatusCoreEntity(object.groupingPeriod || PeriodGroup.WEEKLY, object.startDate, object.endDate, userId);
    entityCore.status = object?.status || null;
    return entityCore;
  }

  public static toApi(entity: OrderQuantityStatusEntity[]): OrderQuantityStatusResponse[] {
    if (entity?.length === 0) {
      return [];
    }
    return entity.map((item) => new OrderQuantityStatusResponse(item.count, item.year, item.month, item.week, item.day, item.status));
  }
}
