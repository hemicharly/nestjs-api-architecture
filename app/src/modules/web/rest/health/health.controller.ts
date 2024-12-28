import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiDocGenericGet } from '@src/modules/web/config/swagger/decorators';
import { HealthCheckResultResponse } from '@src/modules/web/rest/health/response';
import { HealthCheckResultMapper } from '@src/modules/web/rest/health/mappers';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly dbHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiDocGenericGet('health', HealthCheckResultResponse)
  @HealthCheck()
  async check(): Promise<HealthCheckResultResponse> {
    const healthCheckResult = await this.healthCheckService.check([async () => this.dbHealthIndicator.pingCheck('database', { timeout: 3000 })]);
    const info = { ...healthCheckResult.info };
    info['application'] = {
      status: 'up',
      uptime: process.uptime(),
    };
    return HealthCheckResultMapper.toApi({ ...healthCheckResult, info: info });
  }
}
