import { OrderQueryRequest } from '@src/entrypoints/web/rest/orders/request';
import { Request } from 'express';
import {
  OrderCoreEntity,
  OrderPaginationCoreEntity,
  OrderQueryCoreEntity
} from '@core/domain/entities/orders';
import { PaginationCoreEntity } from '@core/domain/entities/shared';
import { OrderQueryAppMapper } from '@entrypoints/web/rest/orders/mappers';
import { OrderStatus } from '@core/domain/enums';
import {
  OrderPaginationResponse,
  OrderTotalHoursResponse
} from '@entrypoints/web/rest/orders/response';

/**
 * Implementation of test to 'order-query-app.mapper.ts'
 */
describe('order-query-app.mapper.ts', () => {
  it('should correctly map from API request to OrderQueryCoreEntity', () => {
    const apiRequest: OrderQueryRequest = {
      page: 1,
      pageSize: 10,
      status: OrderStatus.OPEN,
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    };

    const requestMock: Request = { userId: 'user123' } as Request;

    const entity = OrderQueryAppMapper.fromApi(apiRequest, requestMock);

    expect(entity).toBeInstanceOf(OrderQueryCoreEntity);
    expect(entity.pagination).toBeInstanceOf(PaginationCoreEntity);
    expect(entity.pagination.page).toBe(apiRequest.page);
    expect(entity.pagination.pageSize).toBe(apiRequest.pageSize);
    expect(entity.status).toBe(apiRequest.status);
    expect(entity.startDate).toBe(apiRequest.startDate);
    expect(entity.endDate).toBe(apiRequest.endDate);
    expect(entity.employeeId).toBe(requestMock.userId);
  });

  it('should map null values to null for optional fields', () => {
    const apiRequest: OrderQueryRequest = {
      page: 1,
      pageSize: 10
    };

    const requestMock: Request = { userId: 'user123' } as Request;

    const entity = OrderQueryAppMapper.fromApi(apiRequest, requestMock);

    expect(entity.status).toBeNull();
    expect(entity.startDate).toBeNull();
    expect(entity.endDate).toBeNull();
  });

  it('should correctly map from OrderPaginationCoreEntity to OrderPaginationResponse', () => {
    const pagination = new PaginationCoreEntity(1, 10, 100);
    const orderCoreEntities: OrderCoreEntity[] = [
      {
        id: '1',
        employeeId: 'emp1',
        serviceDescription: 'Service 1',
        companyName: 'Company A',
        schedulingDate: '2024-01-01',
        startDatetime: '2024-01-01T10:00:00Z',
        endDatetime: '2024-01-01T12:00:00Z',
        endComment: 'Completed',
        totalHours: { hours: 2, minutes: 0, seconds: 0 },
        status: OrderStatus.FINISHED,
        updatedAt: '2024-01-01T12:00:00Z',
        createdAt: '2024-01-01T10:00:00Z'
      }
    ];

    const entity = new OrderPaginationCoreEntity(pagination, orderCoreEntities);

    const apiResponse: OrderPaginationResponse = OrderQueryAppMapper.toApi(entity);

    expect(apiResponse.pagination.page).toBe(pagination.page);
    expect(apiResponse.pagination.pageSize).toBe(pagination.pageSize);
    expect(apiResponse.pagination.total).toBe(pagination.total);

    expect(apiResponse.items[0].id).toBe('1');
    expect(apiResponse.items[0].employeeId).toBe('emp1');
    expect(apiResponse.items[0].serviceDescription).toBe('Service 1');
    expect(apiResponse.items[0].totalHours.hours).toBe(2);
    expect(apiResponse.items[0].totalHours.minutes).toBe(0);
    expect(apiResponse.items[0].totalHours.seconds).toBe(0);

    expect(apiResponse.totalHours).toBeInstanceOf(OrderTotalHoursResponse);
    expect(apiResponse.totalHours.hours).toBe(2);
  });

  it('should return empty items and zero total hours if no orders exist', () => {
    const pagination = new PaginationCoreEntity(1, 10, 0);
    const orderCoreEntities = [];

    const entity = new OrderPaginationCoreEntity(pagination, orderCoreEntities);
    const apiResponse: OrderPaginationResponse = OrderQueryAppMapper.toApi(entity);

    expect(apiResponse.items).toEqual([]);

    expect(apiResponse.totalHours.hours).toBe(0);
    expect(apiResponse.totalHours.minutes).toBe(0);
    expect(apiResponse.totalHours.seconds).toBe(0);
  });
});
