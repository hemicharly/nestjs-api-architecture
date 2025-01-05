import { IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@core/domain/enums/order-status.enum';
import { PeriodGroup } from '@core/domain/enums/period-group.enum';

export class OrderQueryQuantityStatusRequest {
  @ApiProperty({
    description: 'Order scheduling start date.',
    required: true,
    format: 'date'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be a valid date in the format YYYY-MM-DD'
  })
  readonly startDate: string;

  @ApiProperty({
    description: 'Order scheduling end date.',
    required: true,
    format: 'date'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be a valid date in the format YYYY-MM-DD'
  })
  readonly endDate: string;

  @ApiProperty({
    description: 'Grouping by service order period.',
    required: false,
    example: 'WEEKLY',
    enum: PeriodGroup,
    default: 'WEEKLY'
  })
  @IsEnum(PeriodGroup)
  @IsOptional()
  readonly groupingPeriod?: PeriodGroup;

  @ApiProperty({
    description: 'Order Service status.',
    required: false,
    example: 'OPEN',
    enum: OrderStatus
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;
}
