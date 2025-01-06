import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { IntegrationLogger } from '@shared/config/integrations/audit';
import { TracerContextAudit } from '@shared/audit';

/**
 * Class responsible for managing API integration interceptor.
 *
 *
 * @example
 *
 * ```typescript
 * import { WebhookIntegrationClientProviderInterface } from '@core/providers/oauth';
 * import { Injectable, Logger } from '@nestjs/common';
 * import { firstValueFrom } from 'rxjs';
 * import { HttpService } from '@nestjs/axios';
 * import { IntegrationInterceptor } from '@shared/config/integrations';
 *
 * @Injectable()
 * export class WebhookIntegrationClientProviderImpl implements WebhookIntegrationClientProviderInterface {
 *   private readonly logger = new Logger(WebhookIntegrationClientProviderImpl.name);
 *
 *   constructor(private readonly httpService: HttpService) {
 *     // Instantiate the class
 *     new IntegrationInterceptor('webhook-notification', this.logger, httpService);
 *   }
 *
 * }
 * ```
 *
 * @class IntegrationInterceptor
 */
export class IntegrationInterceptor {
  /**
   * Defines the HTTP status code for internal server errors.
   * Used as the default value in case of request failures.
   * The code 500 represents the "Internal Server Error".
   */
  private readonly HTTP_STATUS_ERROR: number = 500;

  /**
   * Constructor of the `IntegrationInterceptor` class.
   * Initializes the necessary parameters for HTTP requests.
   *
   * @param applicationIdName - The name or identifier of the application making the integration.
   * @param logger - Logger instance for recording events and errors during processing.
   * @param httpService - HTTP service instance (HttpService) for request interception.
   *
   * The constructor also sets up request and response interceptors by calling the `setupInterceptors` method.
   */
  constructor(
    private readonly applicationIdName: string,
    private readonly logger: Logger,
    private readonly httpService: HttpService
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
      (error) => this.handleError(error)
    );
    this.httpService.axiosRef.interceptors.response.use(
      (response) => this.handleResponseSuccess(response),
      (error) => this.handleResponseError(error)
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
    /*TODO: Implement logic to invoke the OAuth2 service*/
    config.headers['x-application-id-name'] = this.applicationIdName;
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
    const responseData = config.method?.toUpperCase() !== 'GET' && data ? data : null;
    IntegrationLogger.logAudit(this.logger, config, responseData, status);
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
    const status = response?.status ?? this.HTTP_STATUS_ERROR;
    const responseData = response?.data ?? message;
    IntegrationLogger.logAudit(this.logger, config, responseData, status, true);
    return Promise.reject(error);
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
