import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderCreationRequest {
  @ApiProperty({
    description: 'Order Service description.',
    example: 'Prestação de Serviços'
  })
  @IsString()
  @IsNotEmpty()
  readonly serviceDescription: string;

  @ApiProperty({ description: "Name of the customer's.", example: 'Company' })
  @IsString()
  @IsNotEmpty()
  readonly companyName: string;

  @ApiProperty({
    description: "Latitude of the customer's address.",
    example: '-22.897140306896276'
  })
  @IsNumber()
  @IsNotEmpty()
  readonly companyAddressLatitude: number;

  @ApiProperty({
    description: "Longitude of the customer's address.",
    example: '-47.06153484719727'
  })
  @IsNumber()
  @IsNotEmpty()
  readonly companyAddressLongitude: number;

  @ApiProperty({
    description: 'Order Service scheduling date.',
    format: 'date'
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'schedulingDate must be a valid date in the format YYYY-MM-DD'
  })
  @IsNotEmpty()
  readonly schedulingDate: string;
}
