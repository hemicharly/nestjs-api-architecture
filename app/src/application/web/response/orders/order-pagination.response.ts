import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '@application/web/response/pagination/pagination.response';
import { OrderItemsResponse } from '@application/web/response/orders/order-items.response';
import { OrderTotalHoursResponse } from '@application/web/response/orders/order-total-hours.response';

export class OrderPaginationResponse {
  @ApiProperty({ description: 'Show pagination.', type: PaginationResponse })
  pagination: PaginationResponse;

  @ApiProperty({
    description: 'Shows order items.',
    type: OrderItemsResponse,
    isArray: true,
  })
  items: OrderItemsResponse[];

  @ApiProperty({
    description: 'Shows the total calculation in hours, minutes and seconds.',
    type: OrderTotalHoursResponse,
  })
  totalHours?: OrderTotalHoursResponse;
}
