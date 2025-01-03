import { OrderQueryQuantityStatusRequest } from '@src/entrypoints/web/rest/orders/request';
import { Request } from 'express';
import { OrderQuantityStatusEntity, OrderQueryQuantityStatusCoreEntity } from '@core/domain/entities/orders';
import { OrderStatus, PeriodGroup } from '@core/domain/enums';
import { OrderQuantityStatusResponse } from '@src/entrypoints/web/rest/orders/response';
import { OrderQueryQuantityStatusAppMapper } from '@entrypoints/web/rest/orders/mappers';

/**
 * Implementation of test to 'order-query-quantity-status-core.entity.ts'
 */
describe('order-query-quantity-status-core.entity.ts', () => {
  it('should correctly map from API request to OrderQueryQuantityStatusCoreEntity', () => {
    const apiRequest: OrderQueryQuantityStatusRequest = {
      groupingPeriod: PeriodGroup.MONTHLY,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: OrderStatus.FINISHED,
    };

    const requestMock: Request = { userId: 'user123' } as Request;

    const entity = OrderQueryQuantityStatusAppMapper.fromApi(apiRequest, requestMock);

    expect(entity).toBeInstanceOf(OrderQueryQuantityStatusCoreEntity);
    expect(entity.groupingPeriod).toBe(apiRequest.groupingPeriod);
    expect(entity.startDate).toBe(apiRequest.startDate);
    expect(entity.endDate).toBe(apiRequest.endDate);
    expect(entity.status).toBe(apiRequest.status);
    expect(entity.employeeId).toBe(requestMock.userId);
  });

  it('should set default groupingPeriod to WEEKLY if not provided', () => {
    const apiRequest: OrderQueryQuantityStatusRequest = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    };

    const requestMock: Request = { userId: 'user123' } as Request;

    const entity = OrderQueryQuantityStatusAppMapper.fromApi(apiRequest, requestMock);

    expect(entity.groupingPeriod).toBe(PeriodGroup.WEEKLY);
  });

  it('should map null values to null for optional fields', () => {
    const apiRequest: OrderQueryQuantityStatusRequest = {
      groupingPeriod: PeriodGroup.MONTHLY,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    };

    const requestMock: Request = { userId: 'user123' } as Request;

    const entity = OrderQueryQuantityStatusAppMapper.fromApi(apiRequest, requestMock);

    expect(entity.status).toBeNull();
  });

  it('should correctly map from OrderQuantityStatusEntity to OrderQuantityStatusResponse', () => {
    const entity: OrderQuantityStatusEntity[] = [new OrderQuantityStatusEntity(100, 2024, 1, 1, 1, OrderStatus.FINISHED)];

    const apiResponse: OrderQuantityStatusResponse[] = OrderQueryQuantityStatusAppMapper.toApi(entity);

    expect(apiResponse.length).toBe(1);
    expect(apiResponse[0].quantity).toBe(100);
    expect(apiResponse[0].year).toBe(2024);
    expect(apiResponse[0].month).toBe(1);
    expect(apiResponse[0].week).toBe(1);
    expect(apiResponse[0].day).toBe(1);
    expect(apiResponse[0].status).toBe(OrderStatus.FINISHED);
  });

  it('should return an empty array if no entities are provided', () => {
    const entity: OrderQuantityStatusEntity[] = [];

    const apiResponse: OrderQuantityStatusResponse[] = OrderQueryQuantityStatusAppMapper.toApi(entity);

    expect(apiResponse).toEqual([]);
  });

  it('should handle null status when mapping to OrderQuantityStatusResponse', () => {
    const entity: OrderQuantityStatusEntity[] = [new OrderQuantityStatusEntity(100, 2024, 1, 1, 1, null)];

    const apiResponse: OrderQuantityStatusResponse[] = OrderQueryQuantityStatusAppMapper.toApi(entity);

    expect(apiResponse[0].status).toBeNull();
  });
});
