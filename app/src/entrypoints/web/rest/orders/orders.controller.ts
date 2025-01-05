import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import {
  OrderCreationUsecaseInterface,
  OrderEndUsecaseInterface,
  OrderFindByIdUsecaseInterface,
  OrderQueryQuantityStatusUsecaseInterface,
  OrderQueryUsecaseInterface,
  OrderStartUsecaseInterface
} from '@core/usecases/orders';
import { ApiKeyGuard } from '@entrypoints/web/shared/middleware/apikey';
import {
  OrderCreateResponse,
  OrderPaginationResponse,
  OrderQuantityStatusResponse,
  OrderItemsResponse
} from '@src/entrypoints/web/rest/orders/response';
import {
  OrderQueryRequest,
  OrderCreationRequest,
  OrderStartRequest,
  OrderEndRequest,
  OrderQueryQuantityStatusRequest
} from '@src/entrypoints/web/rest/orders/request';
import {
  ApiDocGenericGetAll,
  ApiDocGenericGetOne,
  ApiDocGenericGetPagination,
  ApiDocGenericPatch,
  ApiDocGenericPost
} from '@src/entrypoints/web/config/swagger/decorators';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  OrderCreationAppMapper,
  OrderEndAppMapper,
  OrderFindByIdAppMapper,
  OrderQueryAppMapper,
  OrderQueryQuantityStatusAppMapper,
  OrderStartAppMapper
} from '@src/entrypoints/web/rest/orders/mappers';
import {
  OrderCreationUseCaseImpl,
  OrderEndUsecaseImpl,
  OrderFindByIdUsecaseImpl,
  OrderQueryQuantityStatusUsecaseImpl,
  OrderQueryUsecaseImpl,
  OrderStartUsecaseImpl
} from '@core/usecases/orders/impl';

@ApiTags('Orders')
@ApiSecurity('X-Api-Key')
@Controller('v1/orders')
@UseGuards(ApiKeyGuard)
export class OrdersController {
  @Inject(OrderCreationUseCaseImpl)
  private readonly orderCreationUseCase: OrderCreationUsecaseInterface;

  @Inject(OrderQueryUsecaseImpl)
  private readonly orderQueryUsecase: OrderQueryUsecaseInterface;

  @Inject(OrderQueryQuantityStatusUsecaseImpl)
  private readonly orderQueryQuantityStatusUsecase: OrderQueryQuantityStatusUsecaseInterface;

  @Inject(OrderFindByIdUsecaseImpl)
  private readonly orderFindByIdUsecase: OrderFindByIdUsecaseInterface;

  @Inject(OrderStartUsecaseImpl)
  private readonly orderStartUsecase: OrderStartUsecaseInterface;

  @Inject(OrderEndUsecaseImpl)
  private readonly orderEndUsecase: OrderEndUsecaseInterface;

  @Post()
  @HttpCode(201)
  @ApiDocGenericPost('orders', OrderPaginationResponse)
  async createOrder(
    @Req() req: Request,
    @Body() createOrderRequestDto: OrderCreationRequest
  ): Promise<OrderCreateResponse> {
    const entityCore = OrderCreationAppMapper.fromApi(createOrderRequestDto, req);
    const orderCoreEntity = await this.orderCreationUseCase.execute(entityCore);
    return OrderCreationAppMapper.toApi(orderCoreEntity);
  }

  @Get()
  @HttpCode(200)
  @ApiDocGenericGetPagination('orders', OrderPaginationResponse)
  async getFilter(
    @Req() req: Request,
    @Query() query: OrderQueryRequest
  ): Promise<OrderPaginationResponse> {
    const queryCore = OrderQueryAppMapper.fromApi(query, req);
    const paginationCoreEntity = await this.orderQueryUsecase.execute(queryCore);
    return OrderQueryAppMapper.toApi(paginationCoreEntity);
  }

  @Get('/quantity')
  @HttpCode(200)
  @ApiDocGenericGetAll('orders quantity', OrderQuantityStatusResponse)
  async getQuantityStatus(
    @Req() req: Request,
    @Query() query: OrderQueryQuantityStatusRequest
  ): Promise<OrderQuantityStatusResponse[]> {
    const queryCore = OrderQueryQuantityStatusAppMapper.fromApi(query, req);
    const orderQuantityStatusEntity = await this.orderQueryQuantityStatusUsecase.execute(queryCore);
    return OrderQueryQuantityStatusAppMapper.toApi(orderQuantityStatusEntity);
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiDocGenericGetOne('order', OrderItemsResponse)
  async getOrderById(@Req() req: Request, @Param('id') id: string): Promise<OrderItemsResponse> {
    const orderFindByIdCoreEntity = OrderFindByIdAppMapper.fromApi(id, req);
    const entityCore = await this.orderFindByIdUsecase.execute(orderFindByIdCoreEntity);
    return OrderFindByIdAppMapper.toApi(entityCore);
  }

  @Patch('/:id/start')
  @HttpCode(204)
  @ApiDocGenericPatch(
    'start order',
    'Register the start of the order.<br><br>**It is necessary to send geolocation data correctly, with an accuracy of 200 meters.**'
  )
  async startOrder(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() startOrderRequest: OrderStartRequest
  ): Promise<void> {
    const orderStartCoreEntity = OrderStartAppMapper.fromApi(id, startOrderRequest, req);
    return await this.orderStartUsecase.execute(orderStartCoreEntity);
  }

  @Patch('/:id/end')
  @HttpCode(204)
  @ApiDocGenericPatch(
    'end order',
    'Register the end of the order.<br><br>**It is necessary to send geolocation data correctly, with an accuracy of 200 meters.**'
  )
  async endOrder(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() endOrderRequest: OrderEndRequest
  ): Promise<void> {
    const orderEndCoreEntity = OrderEndAppMapper.fromApi(id, endOrderRequest, req);
    return await this.orderEndUsecase.execute(orderEndCoreEntity);
  }
}
