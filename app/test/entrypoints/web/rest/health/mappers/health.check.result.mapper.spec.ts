import { HealthCheckResult } from '@nestjs/terminus';
import { HealthCheckResultResponse } from '@src/entrypoints/web/rest/health/response';
import { HealthCheckResultMapper } from '@entrypoints/web/rest/health/mappers';
import packageJson from '@packageJson';

/**
 * Implementation of test to 'health.check.result.mapper.ts'
 */
describe('health.check.result.mapper.ts', () => {
  it('should correctly map HealthCheckResult to HealthCheckResultResponse', () => {
    const healthCheckResult: HealthCheckResult = {
      status: 'ok',
      error: null,
      info: {
        application: {
          status: 'up',
          version: packageJson.version,
          uptime: process.uptime()
        }
      },
      details: {
        database: {
          status: 'up'
        }
      }
    };

    const apiResponse: HealthCheckResultResponse = HealthCheckResultMapper.toApi(healthCheckResult);

    expect(apiResponse.status).toBe(healthCheckResult.status);
    expect(apiResponse.info).toEqual(healthCheckResult.info);
    expect(apiResponse.error).toBe(healthCheckResult.error);
    expect(apiResponse.details).toEqual(healthCheckResult.details);
  });

  it('should correctly map HealthCheckResult with null info, error, and details', () => {
    const healthCheckResult: HealthCheckResult = {
      status: 'shutting_down',
      error: {
        application: {
          status: 'down',
          error: 'Database unreachable'
        }
      },
      info: null,
      details: null
    };

    const apiResponse: HealthCheckResultResponse = HealthCheckResultMapper.toApi(healthCheckResult);

    expect(apiResponse.status).toBe(healthCheckResult.status);
    expect(apiResponse.info).toBeNull();
    expect(apiResponse.error).toBe(healthCheckResult.error);
    expect(apiResponse.details).toBeNull();
  });
});
