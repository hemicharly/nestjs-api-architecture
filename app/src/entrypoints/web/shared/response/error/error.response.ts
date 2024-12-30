import { ApiProperty } from '@nestjs/swagger';
import { ErrorItemResponse } from '@entrypoints/web/shared/response/error/error-item.response';

export class ErrorResponse {
  @ApiProperty({ type: ErrorItemResponse, isArray: true })
  errors: ErrorItemResponse[];
}
