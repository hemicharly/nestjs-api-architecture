import { ApiProperty } from '@nestjs/swagger';
import type { HealthIndicatorResult, HealthCheckStatus } from '@nestjs/terminus/dist';

export class HealthCheckResultResponse {
  @ApiProperty({
    description: 'Health check show status.',
    example: 'ok',
  })
  status: HealthCheckStatus;

  @ApiProperty({
    description: 'Health check show information.',
    example: {
      database: {
        status: 'up',
      },
    },
  })
  info?: HealthIndicatorResult;

  @ApiProperty({
    description: 'Health check show error.',
    example: {
      error: {},
    },
  })
  error?: HealthIndicatorResult;

  @ApiProperty({
    description: 'Health check show details.',
    example: {
      database: {
        status: 'up',
      },
    },
  })
  details: HealthIndicatorResult;
}
