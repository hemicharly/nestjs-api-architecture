import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@core/domain/enums/order-status.enum';
import { OrderTotalHoursResponse } from '@src/entrypoints/web/rest/orders/response/order-total-hours.response';

export class OrderItemsResponse {
  @ApiProperty({
    description: 'Order ID.',
    example: '6661fcaf3b668d07251bbafa',
  })
  id: string;

  @ApiProperty({
    description: 'Employee ID logged into the application.',
    format: 'uuid',
  })
  employeeId: string;

  @ApiProperty({
    description: 'Order Service description.',
    example: 'Prestação de Serviços',
  })
  serviceDescription: string;

  @ApiProperty({ description: "Name of the customer's.", example: 'Company' })
  companyName: string;

  @ApiProperty({
    description: 'Order Service scheduling date.',
    format: 'date',
  })
  schedulingDate: string;

  @ApiProperty({
    description: 'Start date time of order.',
    required: false,
    format: 'date-time',
  })
  startDatetime?: string;

  @ApiProperty({
    description: 'End date time of order.',
    required: false,
    format: 'date-time',
  })
  endDatetime?: string;

  @ApiProperty({
    description: 'End comment of order.',
    required: false,
    example: 'Ocorreu tudo conforme o esperado',
  })
  endComment?: string;

  @ApiProperty({
    description: 'Shows the total calculation in hours, minutes and seconds.',
    type: OrderTotalHoursResponse,
  })
  totalHours?: OrderTotalHoursResponse;

  @ApiProperty({
    description: 'Order Service status.',
    example: 'OPEN',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Order Service last update date.',
    format: 'date-time',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Order Service created date.',
    format: 'date-time',
  })
  createdAt: string;
}
