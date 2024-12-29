import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { IntegrationLoggerDto } from '@infrastructure/integrations/shared/audit';
import { TracerContextAudit } from '@shared/audit';

/**
 * Class responsible for managing API integration audit logs.
 *
 *
 * @example
 *
 * ```typescript
 * import { WebhookIntegrationClientProvider } from '@core/providers/integrations';
 * import { Injectable, Logger } from '@nestjs/shared';
 * import { firstValueFrom } from 'rxjs';
 * import { HttpService } from '@nestjs/axios';
 * import { IntegrationAuditCommon } from '@infrastructure/integrations/shared/audit';
 *
 * @Injectable()
 * export class WebhookIntegrationClientProviderImpl implements WebhookIntegrationClientProvider {
 *   private readonly logger = new Logger(WebhookIntegrationClientProviderImpl.name);
 *
 *   constructor(private readonly httpService: HttpService) {
 *     // Instantiate the class
 *     new IntegrationAuditCommon('webhook-notification', this.logger, httpService);
 *   }
 *
 * }
 * ```
 *
 * @class IntegrationAuditCommon
 */
export class IntegrationAuditCommon {
  /**
   * Defines the HTTP status code for internal server errors.
   * Used as the default value in case of request failures.
   * The code 500 represents the "Internal Server Error".
   */
  private readonly HTTP_STATUS_ERROR: number = 500;

  /**
   * Constructor of the `IntegrationAuditCommon` class.
   * Initializes the necessary parameters for auditing HTTP requests.
   *
   * @param application - The name or identifier of the application making the integration.
   * @param logger - Logger instance for recording events and errors during processing.
   * @param httpService - HTTP service instance (HttpService) for request interception.
   *
   * The constructor also sets up request and response interceptors by calling the `setupInterceptors` method.
   */
  constructor(
    private readonly application: string,
    private readonly logger: Logger,
    private readonly httpService: HttpService,
  ) {
    this.setupInterceptors();
  }

  /**
   * Sets up the interceptors to log the request start time
   * and audit the responses or errors of HTTP requests.
   */
  private setupInterceptors(): void {
    this.httpService.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.handleRequest(config),
      (error) => this.handleError(error),
    );
    this.httpService.axiosRef.interceptors.response.use(
      (response) => this.handleResponseSuccess(response),
      (error) => this.handleResponseError(error),
    );
  }

  /**
   * Handles the request before sending it, adding the start time
   * to the request headers.
   *
   * @param config - The HTTP request configuration.
   * @returns The modified request configuration.
   */
  private handleRequest(config: any): InternalAxiosRequestConfig {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers['request-start-time'] = process.hrtime();
    config.headers['x-tracer-id'] = TracerContextAudit.getContextTracerId();
    return config;
  }

  /**
   * Handles the response of a successful request, logging the audit information.
   *
   * @param response - The HTTP response.
   * @returns The original HTTP response.
   */
  private handleResponseSuccess(response: AxiosResponse): AxiosResponse {
    const { config, status, data } = response;
    const startTime = config.headers['request-start-time'] || [0, 0];
    const responseData = config.method?.toUpperCase() !== 'GET' && data ? data : null;
    this.logAudit(config, responseData, status, startTime);
    return response;
  }

  /**
   * Handles the error response of a failed request, logging the audit information for the error.
   *
   * @param error - The error that occurred during the request.
   * @returns The rejected promise with the error.
   */
  private handleResponseError(error: AxiosError): Promise<any> {
    const { config, response, message } = error;
    const startTime = config.headers['request-start-time'] || [0, 0];
    const status = response?.status ?? this.HTTP_STATUS_ERROR;
    const responseData = response?.data ?? message;
    this.logAudit(config, responseData, status, startTime, true);
    return Promise.reject(error);
  }

  /**
   * Creates an `IntegrationLoggerDto` object for logging purposes.
   *
   * @param config - The HTTP request configuration.
   * @param responseData - The response data or error message.
   * @param status - The HTTP response status.
   * @param startTime - The request start time.
   * @param isError - Flag indicating if it's an error log.
   */
  private logAudit(config: AxiosRequestConfig, responseData: any, status: number, startTime: [number, number], isError: boolean = false): void {
    const integrationLoggerDto = this.createIntegrationLoggerDto(config, responseData, status, startTime);
    const logMessage = JSON.stringify(integrationLoggerDto);
    if (isError) {
      this.logger.error(logMessage);
      return;
    }
    this.logger.log(logMessage);
  }

  /**
   * Creates the audit DTO for the integration log.
   *
   * @param config - The HTTP request configuration.
   * @param responseData - The response data or error message.
   * @param status - The HTTP response status.
   * @param startTime - The request start time.
   * @returns An `IntegrationLoggerDto` object containing the audit information.
   */
  private createIntegrationLoggerDto(config: AxiosRequestConfig, responseData: any, status: number, startTime: [number, number]): IntegrationLoggerDto {
    const tracerId = <string>config.headers['x-tracer-id'];
    const method = `${config.method?.toUpperCase()} ${config.url}`;
    return new IntegrationLoggerDto(tracerId, this.application, method, config.headers, config.params, config.data, responseData, status, startTime);
  }

  /**
   * Handles global errors during the request process, with detailed error logging.
   *
   * @param error - The error that occurred during the request.
   * @returns The rejected promise with the error.
   */
  private handleError(error: any): Promise<any> {
    if (error?.isAxiosError) {
      this.logger.error('[AUDIT LOG] Request error', error.response || error.message);
    } else {
      this.logger.error('[AUDIT LOG] Request error', error);
    }
    return Promise.reject(error);
  }
}
