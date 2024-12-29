import { ApiProperty } from '@nestjs/swagger';

export class ErrorItemResponse {
  @ApiProperty({ example: 'Error code.' })
  code: string;

  @ApiProperty({ example: 'Error message.' })
  message: string;
}
