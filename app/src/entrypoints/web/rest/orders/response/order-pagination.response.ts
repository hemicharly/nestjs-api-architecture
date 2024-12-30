import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '@entrypoints/web/shared/response/pagination/pagination.response';
import { OrderItemsResponse } from '@src/entrypoints/web/rest/orders/response/order-items.response';
import { OrderTotalHoursResponse } from '@src/entrypoints/web/rest/orders/response/order-total-hours.response';

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
