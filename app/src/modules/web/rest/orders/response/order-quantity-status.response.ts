import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@core/domain/enums/order-status.enum';

export class OrderQuantityStatusResponse {
  @ApiProperty({ description: 'Quantity.', example: '10' })
  readonly quantity: number;

  @ApiProperty({ description: 'Year.', example: '2024' })
  readonly year: number;

  @ApiProperty({ description: 'Month.', example: '6' })
  readonly month: number;

  @ApiProperty({ description: 'Week.', example: '23' })
  readonly week: number;

  @ApiProperty({ description: 'Day.', example: '20' })
  readonly day: number;

  @ApiProperty({
    description: 'Order Service status.',
    example: 'OPEN',
    enum: OrderStatus,
  })
  readonly status: OrderStatus;

  constructor(quantity: number, year: number, month: number, week: number, day: number, status: OrderStatus) {
    this.quantity = quantity || 0;
    this.year = year || 0;
    this.month = month || 0;
    this.week = week || 0;
    this.day = day || 0;
    this.status = status || null;
  }
}
