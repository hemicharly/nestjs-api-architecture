import { Request } from 'express';
import { OrderPaginationCoreEntity, OrderQueryCoreEntity } from '@core/domain/entities/orders';
import { PaginationCoreEntity } from '@core/domain/entities/common';
import { OrderQueryRequest } from '@src/entrypoints/web/rest/orders/request';
import { OrderPaginationResponse, OrderTotalHoursResponse } from '@src/entrypoints/web/rest/orders/response';
import { PaginationResponse } from '@entrypoints/web/shared/response/pagination';

export class OrderQueryAppMapper {
  public static fromApi(object: OrderQueryRequest, { userId }: Request): OrderQueryCoreEntity {
    const entity = new OrderQueryCoreEntity(new PaginationCoreEntity(object.page, object.pageSize), userId);
    entity.status = object?.status || null;
    entity.startDate = object?.startDate || null;
    entity.endDate = object?.endDate || null;
    return entity;
  }

  public static toApi(entity: OrderPaginationCoreEntity): OrderPaginationResponse {
    return {
      pagination: new PaginationResponse(entity?.pagination?.page, entity?.pagination?.pageSize, entity?.pagination?.total),
      items: entity.items.map((item) => {
        return {
          id: item.id,
          employeeId: item.employeeId,
          serviceDescription: item.serviceDescription,
          companyName: item.companyName,
          schedulingDate: item.schedulingDate,
          startDatetime: item?.startDatetime || null,
          endDatetime: item?.endDatetime || null,
          endComment: item?.endComment || null,
          totalHours: item.totalHours,
          status: item.status,
          updatedAt: item.updatedAt,
          createdAt: item.createdAt,
        };
      }),
      totalHours: new OrderTotalHoursResponse(entity.totalHours.hours, entity.totalHours.minutes, entity.totalHours.seconds),
    };
  }
}
