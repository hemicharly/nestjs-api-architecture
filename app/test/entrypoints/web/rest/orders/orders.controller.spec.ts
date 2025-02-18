import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyGuard } from '@entrypoints/web/shared/middleware/apikey';
import {
  OrderCreationUseCaseImpl,
  OrderEndUsecaseImpl,
  OrderFindByIdUsecaseImpl,
  OrderQueryQuantityStatusUsecaseImpl,
  OrderQueryUsecaseImpl,
  OrderStartUsecaseImpl
} from '@core/usecases/orders/impl';
import {
  OrderCreationRequest,
  OrderEndRequest,
  OrderQueryQuantityStatusRequest,
  OrderQueryRequest,
  OrderStartRequest
} from '@entrypoints/web/rest/orders/request';
import {
  OrderCreateResponse,
  OrderItemsResponse,
  OrderPaginationResponse,
  OrderQuantityStatusResponse
} from '@entrypoints/web/rest/orders/response';
import { OrdersController } from '@entrypoints/web/rest/orders';
import { OrderStatus } from '@core/domain/enums';

/**
 * Implementation of test to 'orders.controller.ts'
 */
describe('orders.controller.ts', () => {
  let controller: OrdersController;

  const mockOrderCreationUseCase = { execute: jest.fn() };
  const mockOrderQueryUsecase = { execute: jest.fn() };
  const mockOrderQueryQuantityStatusUsecase = { execute: jest.fn() };
  const mockOrderFindByIdUsecase = { execute: jest.fn() };
  const mockOrderStartUsecase = { execute: jest.fn() };
  const mockOrderEndUsecase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrderCreationUseCaseImpl, useValue: mockOrderCreationUseCase },
        { provide: OrderQueryUsecaseImpl, useValue: mockOrderQueryUsecase },
        {
          provide: OrderQueryQuantityStatusUsecaseImpl,
          useValue: mockOrderQueryQuantityStatusUsecase
        },
        { provide: OrderFindByIdUsecaseImpl, useValue: mockOrderFindByIdUsecase },
        { provide: OrderStartUsecaseImpl, useValue: mockOrderStartUsecase },
        { provide: OrderEndUsecaseImpl, useValue: mockOrderEndUsecase }
      ]
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call OrderCreationUsecaseInterface.execute with correct parameters', async () => {
    const mockRequest = {
      headers: { 'x-api-key': '8c2e7d525bd34adfb52bb1fb24357a2d' },
      body: {}
    } as any;
    const mockDto: OrderCreationRequest = {
      serviceDescription: 'BHUT serviço',
      companyName: 'BHUT',
      companyAddressLatitude: -39.932048,
      companyAddressLongitude: 34.664223,
      schedulingDate: '2024-12-27'
    };
    const mockResponse: OrderCreateResponse = {
      id: '6773205c93b1daa335239f03',
      employeeId: 'a780e1d0-0b60-4a0f-b2a2-fda12ecb81af',
      status: 'OPEN',
      createdAt: '2024-12-30T22:36:12.881Z'
    };
    jest.spyOn(mockOrderCreationUseCase, 'execute').mockResolvedValue(mockResponse);
    const result = await controller.createOrder(mockRequest, mockDto);
    expect(mockOrderCreationUseCase.execute).toHaveBeenCalledWith(expect.anything());
    expect(result).toEqual(expect.anything());
  });

  it('should call OrderQueryUsecaseInterface.execute with correct parameters', async () => {
    const mockRequest = {
      headers: { 'x-api-key': '8c2e7d525bd34adfb52bb1fb24357a2d' },
      body: {}
    } as any;
    const mockDto: OrderQueryRequest = {
      page: 0,
      pageSize: 10
    };
    const mockResponse: OrderPaginationResponse = {
      items: [],
      pagination: {
        page: 0,
        pageSize: 10,
        total: 0
      },
      totalHours: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    };
    jest.spyOn(mockOrderQueryUsecase, 'execute').mockResolvedValue(mockResponse);
    const result = await controller.getFilter(mockRequest, mockDto);
    expect(mockOrderQueryUsecase.execute).toHaveBeenCalledWith(expect.anything());
    expect(result).toEqual(expect.anything());
  });

  it('should call OrderQueryQuantityStatusUsecaseInterface.execute with correct parameters', async () => {
    const mockRequest = {
      headers: { 'x-api-key': '8c2e7d525bd34adfb52bb1fb24357a2d' },
      body: {}
    } as any;
    const mockDto: OrderQueryQuantityStatusRequest = {
      startDate: '2024-12-01',
      endDate: '2024-12-15'
    };
    const mockResponse: OrderQuantityStatusResponse[] = [
      {
        status: OrderStatus.OPEN,
        day: 1,
        month: 12,
        week: 1,
        year: 2024,
        quantity: 10
      }
    ];
    jest.spyOn(mockOrderQueryQuantityStatusUsecase, 'execute').mockResolvedValue(mockResponse);
    const result = await controller.getQuantityStatus(mockRequest, mockDto);
    expect(mockOrderQueryQuantityStatusUsecase.execute).toHaveBeenCalledWith(expect.anything());
    expect(result).toEqual(expect.anything());
  });

  it('should call OrderFindByIdUsecaseInterface.execute with correct parameters', async () => {
    const mockRequest = {
      headers: { 'x-api-key': '8c2e7d525bd34adfb52bb1fb24357a2d' },
      body: {}
    } as any;
    const mockDto: string = '6773205c93b1daa335239f03';
    const mockResponse: OrderItemsResponse = {
      companyName: 'Company',
      createdAt: new Date().toJSON(),
      employeeId: 'a780e1d0-0b60-4a0f-b2a2-fda12ecb81af',
      id: mockDto,
      schedulingDate: '2024-12-10',
      serviceDescription: 'Description',
      status: OrderStatus.OPEN,
      updatedAt: new Date().toJSON()
    };
    jest.spyOn(mockOrderFindByIdUsecase, 'execute').mockResolvedValue(mockResponse);
    const result = await controller.getOrderById(mockRequest, mockDto);
    expect(mockOrderFindByIdUsecase.execute).toHaveBeenCalledWith(expect.anything());
    expect(result).toEqual(expect.anything());
  });

  it('should call OrderStartUsecaseInterface.execute with correct parameters', async () => {
    const mockRequest = {
      headers: { 'x-api-key': '8c2e7d525bd34adfb52bb1fb24357a2d' },
      body: {}
    } as any;
    const mockDto: OrderStartRequest = {
      startDatetime: '2024-12-29T22:59:41.255Z',
      recordedLatitude: 13.174342,
      recordedLongitude: 101.215167
    };
    await controller.startOrder(mockRequest, '6773205c93b1daa335239f03', mockDto);
    expect(mockOrderStartUsecase.execute).toHaveBeenCalledWith(expect.anything());
  });

  it('should call OrderEndUsecaseInterface.execute with correct parameters', async () => {
    const mockRequest = {
      headers: { 'x-api-key': '8c2e7d525bd34adfb52bb1fb24357a2d' },
      body: {}
    } as any;
    const mockDto: OrderEndRequest = {
      endDatetime: '2024-12-29T23:59:41.255Z',
      recordedLatitude: 13.174342,
      recordedLongitude: 101.215167,
      comment: 'Finished'
    };
    await controller.endOrder(mockRequest, '6773205c93b1daa335239f03', mockDto);
    expect(mockOrderEndUsecase.execute).toHaveBeenCalledWith(expect.anything());
  });
});
