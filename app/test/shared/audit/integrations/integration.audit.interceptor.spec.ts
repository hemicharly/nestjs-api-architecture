import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { TracerContextAudit } from '@shared/audit';
import { IntegrationInterceptor } from '@shared/config/integrations';

jest.mock('@nestjs/axios');

/**
 * Implementation of test to 'integration.interceptor.ts'
 */
describe('integration.interceptor.ts', () => {
  let interceptor: IntegrationInterceptor;
  let logger: Logger;
  let httpServiceMock: HttpService;
  let axiosMock: Partial<AxiosInstance>;

  beforeEach(() => {
    logger = new Logger();

    // Mock the AxiosInstance
    axiosMock = {
      interceptors: {
        // @ts-ignore
        request: { use: jest.fn() },
        // @ts-ignore
        response: { use: jest.fn() }
      }
    };

    httpServiceMock = {
      get axiosRef() {
        return axiosMock as AxiosInstance;
      }
    } as HttpService;

    interceptor = new IntegrationInterceptor('test-application', logger, httpServiceMock);
  });

  it('should setup request and response interceptors', () => {
    expect(axiosMock.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(axiosMock.interceptors.response.use).toHaveBeenCalledTimes(1);
  });

  it('should handle a request and add start time and tracer ID', () => {
    const tracerId = new Date().getTime().toString();
    TracerContextAudit.setContextTracerId(tracerId);
    const config = { headers: {} };
    const modifiedConfig = interceptor['handleRequest'](config);
    expect(modifiedConfig.headers['request-start-time']).toBeDefined();
    expect(modifiedConfig.headers['x-tracer-id']).toBeDefined();
    expect(modifiedConfig.headers['x-tracer-id']).toBe(tracerId);
  });

  it('should handle response success and log audit information', () => {
    const mockResponse = {
      config: { headers: {}, method: 'GET' },
      status: 200,
      data: 'mockData'
    };

    const result = interceptor['handleResponseSuccess'](mockResponse as any);

    expect(result).toEqual(mockResponse);
  });
});
