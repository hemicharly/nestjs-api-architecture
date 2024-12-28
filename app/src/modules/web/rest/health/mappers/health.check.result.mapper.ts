import { HealthCheckResultResponse } from '@src/modules/web/rest/health/response';
import { HealthCheckResult } from '@nestjs/terminus';

export class HealthCheckResultMapper {
  public static toApi(healthCheckResult: HealthCheckResult): HealthCheckResultResponse {
    return {
      status: healthCheckResult.status,
      info: healthCheckResult.info,
      error: healthCheckResult.error,
      details: healthCheckResult.details,
    };
  }
}
