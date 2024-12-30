import { OrderCreationRequest } from '@src/entrypoints/web/rest/orders/request';
import { OrderCreateResponse } from '@src/entrypoints/web/rest/orders/response';
import { OrderCoreEntity, OrderCreationCoreEntity } from '@core/domain/entities/orders';
import { Request } from 'express';

export class OrderCreationAppMapper {
  public static fromApi(object: OrderCreationRequest, { userId }: Request): OrderCreationCoreEntity {
    const entity = new OrderCreationCoreEntity(userId);
    entity.serviceDescription = object.serviceDescription;
    entity.companyName = object.companyName;
    entity.companyAddressLatitude = String(object.companyAddressLatitude);
    entity.companyAddressLongitude = String(object.companyAddressLongitude);
    entity.schedulingDate = object.schedulingDate;
    return entity;
  }

  public static toApi(entity: OrderCoreEntity): OrderCreateResponse {
    return {
      id: entity.id,
      employeeId: entity.employeeId,
      status: entity.status,
      createdAt: entity.createdAt,
    };
  }
}
