import { Request } from 'express';
import { OrderEndCoreEntity } from '@core/domain/entities/orders';
import { OrderEndRequest } from '@src/modules/web/rest/orders/request';

export class OrderEndAppMapper {
  public static fromApi(id: string, object: OrderEndRequest, { userId }: Request): OrderEndCoreEntity {
    const entity = new OrderEndCoreEntity(id, userId);
    entity.endDatetime = object.endDatetime;
    entity.recordedLatitude = String(object.recordedLatitude);
    entity.recordedLongitude = String(object.recordedLongitude);
    entity.endComment = object?.comment || null;
    return entity;
  }
}
