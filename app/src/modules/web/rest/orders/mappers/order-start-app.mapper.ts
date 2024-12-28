import { Request } from 'express';
import { OrderStartCoreEntity } from '@core/domain/entities/orders';
import { OrderStartRequest } from '@src/modules/web/rest/orders/request';

export class OrderStartAppMapper {
  public static fromApi(id: string, object: OrderStartRequest, { userId }: Request): OrderStartCoreEntity {
    const entity = new OrderStartCoreEntity(id, userId);
    entity.startDatetime = object.startDatetime;
    entity.recordedLatitude = String(object.recordedLatitude);
    entity.recordedLongitude = String(object.recordedLongitude);
    return entity;
  }
}
