import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '@application/web/response/error/error.response';

@ApiTags('Health')
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  type: ErrorResponse,
})
@Controller('/health')
export class HealthController {
  @Get()
  @HttpCode(200)
  @ApiOkResponse({ description: 'Health was successful.', type: String })
  @ApiOperation({
    summary: 'Returns the health of the API.',
    description: 'Returns the health of the API.',
  })
  getHealth(): string {
    return 'OK';
  }
}
