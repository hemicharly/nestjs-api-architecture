import { ApiProperty } from '@nestjs/swagger';
import { ErrorItemResponse } from '@application/web/response/error/error-item.response';

export class ErrorResponse {
  @ApiProperty({ type: ErrorItemResponse, isArray: true })
  errors: ErrorItemResponse[];
}
