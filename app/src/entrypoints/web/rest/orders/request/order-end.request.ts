import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderEndRequest {
  @ApiProperty({ description: 'End date time of order.', format: 'date-time' })
  @IsDateString()
  @IsNotEmpty()
  readonly endDatetime: string;

  @ApiProperty({
    description: 'Latitude recorded at customer address.',
    example: '-22.897140306896276'
  })
  @IsNumber()
  @IsNotEmpty()
  readonly recordedLatitude: number;

  @ApiProperty({
    description: 'Longitude recorded at customer address.',
    example: '-47.06153484719727'
  })
  @IsNumber()
  @IsNotEmpty()
  readonly recordedLongitude: number;

  @ApiProperty({
    description: 'End comment of order.',
    example: 'Ocorreu tudo conforme o esperado',
    required: false
  })
  @IsOptional()
  readonly comment: string;
}
