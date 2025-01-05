import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthIndicatorResult
} from '@nestjs/terminus';
import { ApiDocGenericGet } from '@src/entrypoints/web/config/swagger/decorators';
import { HealthCheckResultResponse } from '@src/entrypoints/web/rest/health/response';
import { HealthCheckResultMapper } from '@src/entrypoints/web/rest/health/mappers';
import packageJson from '@packageJson';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly dbHealthIndicator: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HttpCode(200)
  @ApiDocGenericGet('health', HealthCheckResultResponse)
  @HealthCheck()
  async check(): Promise<HealthCheckResultResponse> {
    const healthCheckResult = await this.healthCheckService.check([
      async (): Promise<HealthIndicatorResult> =>
        this.dbHealthIndicator.pingCheck('database', { timeout: 3000 })
    ]);
    const info = { ...healthCheckResult.info };
    info['application'] = {
      status: 'up',
      version: packageJson.version,
      uptime: process.uptime()
    };
    return HealthCheckResultMapper.toApi({ ...healthCheckResult, info: info });
  }
}
