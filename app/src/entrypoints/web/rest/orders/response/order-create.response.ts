import { ApiProperty } from '@nestjs/swagger';

export class OrderCreateResponse {
  @ApiProperty({
    description: 'Order ID.',
    example: '6661fcaf3b668d07251bbafa'
  })
  id: string;

  @ApiProperty({
    description: 'Employee ID logged into the application.',
    format: 'uuid'
  })
  employeeId: string;

  @ApiProperty({ description: 'Order Service status.', example: 'OPEN' })
  status: string;

  @ApiProperty({
    description: 'Order Service created date.',
    format: 'date-time'
  })
  createdAt: string;
}
