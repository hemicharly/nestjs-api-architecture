import { HealthCheckResultResponse } from '@application/web/response/health';
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
