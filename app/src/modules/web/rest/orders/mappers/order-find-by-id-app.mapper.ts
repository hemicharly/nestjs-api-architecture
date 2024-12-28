import { Request } from 'express';
import { OrderItemsResponse } from '@src/modules/web/rest/orders/response';
import { OrderCoreEntity, OrderFindByIdCoreEntity } from '@core/domain/entities/orders';

export class OrderFindByIdAppMapper {
  public static fromApi(id: string, { userId }: Request): OrderFindByIdCoreEntity {
    return new OrderFindByIdCoreEntity(id, userId);
  }

  public static toApi(entity: OrderCoreEntity): OrderItemsResponse {
    const response = new OrderItemsResponse();
    response.id = entity.id;
    response.employeeId = entity.employeeId;
    response.serviceDescription = entity.serviceDescription;
    response.companyName = entity.companyName;
    response.schedulingDate = entity.schedulingDate;
    response.startDatetime = entity?.startDatetime || null;
    response.endDatetime = entity?.endDatetime || null;
    response.endComment = entity?.endComment || null;
    response.totalHours = entity.totalHours;
    response.status = entity.status;
    response.updatedAt = entity.updatedAt;
    response.createdAt = entity.createdAt;
    return response;
  }
}
