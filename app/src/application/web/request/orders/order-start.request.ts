import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderStartRequest {
  @ApiProperty({
    description: 'Start date time of order.',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  readonly startDatetime: string;

  @ApiProperty({
    description: 'Latitude recorded at customer address.',
    example: '-22.897140306896276',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly recordedLatitude: number;

  @ApiProperty({
    description: 'Longitude recorded at customer address.',
    example: '-47.06153484719727',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly recordedLongitude: number;
}
