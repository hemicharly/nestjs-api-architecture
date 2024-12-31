import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderQueryCoreEntity } from '@core/domain/entities/orders/order-query-core.entity';
import { OrderStatus } from '@core/domain/enums/order-status.enum';
import { PaginationCoreEntity } from '@core/domain/entities/shared/pagination-core.entity';

export class OrderQueryRequest {
  @ApiProperty({ description: 'Page.' })
  @IsNumberString()
  @IsNotEmpty()
  readonly page: number;

  @ApiProperty({ description: 'Page size.' })
  @IsNumberString()
  @IsNotEmpty()
  readonly pageSize: number;

  @ApiProperty({
    description: 'Order scheduling start date.',
    required: false,
    format: 'date',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be a valid date in the format YYYY-MM-DD',
  })
  @IsOptional()
  readonly startDate?: string;

  @ApiProperty({
    description: 'Order scheduling end date.',
    required: false,
    format: 'date',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate must be a valid date in the format YYYY-MM-DD',
  })
  @IsOptional()
  readonly endDate?: string;

  @ApiProperty({
    description: 'Order Service status.',
    required: false,
    example: 'OPEN',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;

  public static fromApi(request: OrderQueryRequest, employeeId: string): OrderQueryCoreEntity {
    const entityCore = new OrderQueryCoreEntity(new PaginationCoreEntity(request.page, request.pageSize), employeeId);
    entityCore.status = request?.status || null;
    entityCore.startDate = request?.startDate || null;
    entityCore.endDate = request?.endDate || null;
    return entityCore;
  }
}
