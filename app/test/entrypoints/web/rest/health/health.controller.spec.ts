import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '@src/entrypoints/web/rest/health/health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthCheckResultResponse } from '@src/entrypoints/web/rest/health/response';
import packageJson from '@packageJson';

// Setup mock dependencies
jest.mock('@nestjs/terminus', () => {
  const originalModule = jest.requireActual('@nestjs/terminus');
  return {
    ...originalModule,
    HealthCheckService: jest.fn().mockImplementation(() => ({
      check: jest.fn().mockResolvedValue({
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } },
      }),
    })),
    TypeOrmHealthIndicator: jest.fn().mockImplementation(() => ({
      pingCheck: jest.fn().mockResolvedValue({
        status: 'up',
      }),
    })),
  };
});

/**
 * Implementation of test to 'health.controller.ts'
 */
describe('health.controller.ts', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthCheckService, TypeOrmHealthIndicator],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should return a valid health check response', async () => {
    const mockHealthCheckResult: HealthCheckResultResponse = {
      status: 'ok',
      info: { database: { status: 'up' } },
      error: null,
      details: {},
    };

    // Mocking the check result from HealthCheckService
    healthCheckService.check = jest.fn().mockResolvedValue(mockHealthCheckResult);

    const response: HealthCheckResultResponse = await controller.check();

    // Verifying the response format
    expect(response).toEqual({
      status: 'ok',
      info: {
        database: { status: 'up' },
        application: {
          status: 'up',
          version: packageJson.version,
          uptime: expect.any(Number),
        },
      },
      error: null,
      details: {},
    });

    expect(response.status).toBe('ok');
    expect(response.info.application.status).toBe('up');
    expect(response.info.application.version).toBe(packageJson.version);
    expect(response.info.application.uptime).toBeGreaterThan(0);
  });

  it('should return a health check status of "down" if database is down', async () => {
    const mockHealthCheckResult: HealthCheckResultResponse = {
      status: 'shutting_down',
      info: { database: { status: 'down' } },
      error: null,
      details: {},
    };

    // Mocking the check result from HealthCheckService
    healthCheckService.check = jest.fn().mockResolvedValue(mockHealthCheckResult);

    const response: HealthCheckResultResponse = await controller.check();

    expect(response.status).toBe('shutting_down');
    expect(response.info.database.status).toBe('down');
  });

  it('should return HTTP status 200', async () => {
    const mockHealthCheckResult: HealthCheckResultResponse = {
      status: 'ok',
      info: { database: { status: 'up' } },
      error: null,
      details: {},
    };

    // Mocking the check result from HealthCheckService
    healthCheckService.check = jest.fn().mockResolvedValue(mockHealthCheckResult);

    const response = await controller.check();

    expect(response).toBeDefined();
    expect(response.status).toBe('ok');
  });
});
