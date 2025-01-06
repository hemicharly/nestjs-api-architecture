// Set containing sensitive fields that should be masked.
import { AxiosRequestConfig } from 'axios';
import { Logger } from '@nestjs/common';

const SENSITIVE_FIELDS = new Set([
  'password',
  'confirmPassword',
  'confirm',
  'codeConfirm',
  'code',
  'secret',
  'clientSecret',
  'clientId',
  'cvv',
  'pan',
  'x-api-key',
  'api-key',
  'Authorization',
  'authorization',
  'Token',
  'token',
  'Key',
  'key'
]);

/**
 * Class responsible for storing and managing API integration logs.
 * The class ensures that sensitive fields are masked before being logged.
 * @class IntegrationLogger
 */
export class IntegrationLogger {
  /**
   * TracerId of identifier operation
   * @type {string}
   */
  readonly tracerId: string;

  /**
   * Date and time when the log was created.
   * @type {string}
   */
  readonly timestamp: string;

  /**
   * Name of the application that generated the log.
   * @type {string}
   */
  readonly application: string;

  /**
   * API endpoint that was called.
   * @type {string}
   */
  readonly endpoint: string;

  /**
   * HTTP request headers with sensitive fields masked.
   * @type {Record<string, any>}
   */
  readonly headers: Record<string, any>;

  /**
   * HTTP request query parameters with sensitive fields masked.
   * @type {Record<string, any>}
   */
  readonly queryParameters: Record<string, any>;

  /**
   * HTTP request body with sensitive fields masked.
   * @type {Record<string, any>}
   */
  readonly requestBody: Record<string, any>;

  /**
   * HTTP response body received.
   * @type {Record<string, any>}
   */
  readonly responseBody: Record<string, any>;

  /**
   * HTTP status code of the response.
   * @type {number}
   */
  readonly statusCode: number;

  /**
   * Duration (in milliseconds) of the request.
   * @type {number}
   */
  readonly duration: number;

  /**
   * Constructor for the `IntegrationLogger` class.
   * Initializes the properties and masks sensitive fields from the provided data.
   *
   * @param {string} tracerId The tracer id log.
   * @param {string} application The name of the application generating the log.
   * @param {string} endpoint The API endpoint called.
   * @param {Record<string, any>} headers The request headers.
   * @param {Record<string, any>} queryParameters The query parameters of the request.
   * @param {Record<string, any>} requestBody The request body.
   * @param {Record<string, any>} responseBody The response body.
   * @param {number} statusCode The HTTP status code of the response.
   * @param {[number, number]} startTime The start time of the request for calculating duration.
   */
  constructor(
    tracerId: string,
    application: string,
    endpoint: string,
    headers: Record<string, any>,
    queryParameters: Record<string, any>,
    requestBody: Record<string, any>,
    responseBody: Record<string, any>,
    statusCode: number,
    startTime: [number, number]
  ) {
    this.tracerId = tracerId; // Sets the tracerId
    this.timestamp = new Date().toJSON(); // Marks the timestamp of the log
    this.application = application; // Sets the application name
    this.endpoint = endpoint; // Sets the accessed endpoint
    this.headers = this.maskSensitiveFields(headers); // Masks sensitive fields in headers
    this.queryParameters = this.maskSensitiveFields(queryParameters); // Masks sensitive fields in query parameters
    this.requestBody = this.maskSensitiveRequestBody(requestBody); // Masks sensitive fields in request body
    this.responseBody = responseBody; // Sets the response body
    this.statusCode = statusCode; // Sets the response status code
    this.duration = this.elapsedTime(startTime); // Calculates the duration of the request
  }

  /**
   * Calculates the execution time (duration) of the request based on the provided start time.
   *
   * @param {[number, number]} startTime The start time of the request.
   * @returns {number} The duration in milliseconds.
   */
  private elapsedTime(startTime: [number, number]): number {
    const elapsedHrTime: [number, number] = process.hrtime(startTime);
    const elapsedTimeMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    return parseFloat(elapsedTimeMs.toFixed(3)); // Returns the duration in milliseconds with 3 decimal places
  }

  /**
   * Masks the sensitive fields in the request body.
   *
   * @param {Record<string, any>} obj The request body, which may be an object or a string.
   * @returns {Record<string, any>} The object with sensitive fields masked.
   */
  private maskSensitiveRequestBody(obj: Record<string, any>): Record<string, any> {
    if (typeof obj === 'string') {
      try {
        obj = JSON.parse(obj); // Try to parse if it's a JSON string
      } catch (e) {
        return {}; // Return an empty object if parsing fails
      }
    }

    if (!obj || Object.keys(obj).length === 0) {
      return {}; // Return an empty object if there is no data
    }

    // Recursive function to mask sensitive fields
    const maskObject = (target: Record<string, any>): Record<string, any> => {
      const maskedObj: Record<string, any> = {};
      for (const key in target) {
        if (SENSITIVE_FIELDS.has(key)) {
          maskedObj[key] = '****'; // Mask the value of sensitive fields
        } else if (typeof target[key] === 'object' && target[key] !== null) {
          maskedObj[key] = maskObject(target[key]); // Recursion for nested objects
        } else {
          maskedObj[key] = target[key]; // Copy other values without modification
        }
      }
      return maskedObj;
    };

    return maskObject(obj); // Return the object with sensitive fields masked
  }

  /**
   * Masks the sensitive fields in headers or query parameters.
   *
   * @param {Record<string, any>} obj The object containing headers or query parameters.
   * @returns {Record<string, any>} The object with sensitive fields masked.
   */
  private maskSensitiveFields(obj: Record<string, any>): Record<string, any> {
    if (!obj || Object.keys(obj).length === 0) {
      return {}; // Return an empty object if there is no data
    }

    const maskedObj = { ...obj }; // Create a copy of the object
    for (const key in maskedObj) {
      if (SENSITIVE_FIELDS.has(key)) {
        maskedObj[key] = '****'; // Mask the value of sensitive fields
      }
    }
    return maskedObj; // Return the object with sensitive fields masked
  }

  /**
   * Creates an `IntegrationLogger` object for logging purposes.
   *
   * @param logger The logger.
   * @param config - The HTTP request configuration.
   * @param responseData - The response data or error message.
   * @param status - The HTTP response status.
   * @param isError - Flag indicating if it's an error log.
   */
  public static logAudit(
    logger: Logger,
    config: AxiosRequestConfig,
    responseData: Record<string, any>,
    status: number,
    isError: boolean = false
  ): void {
    const startTime: [number, number] = config.headers['request-start-time'] || [0, 0];

    const integrationLoggerDto = this.createIntegrationLoggerDto(
      config,
      responseData,
      status,
      startTime
    );
    const logMessage = JSON.stringify(integrationLoggerDto);
    if (isError) {
      logger.error(logMessage);
      return;
    }
    logger.log(logMessage);
  }

  /**
   * Creates the audit DTO for the integration log.
   *
   * @param config - The HTTP request configuration.
   * @param responseData - The response data or error message.
   * @param status - The HTTP response status.
   * @param startTime - The request start time.
   * @returns An `IntegrationLogger` object containing the audit information.
   */
  private static createIntegrationLoggerDto(
    config: AxiosRequestConfig,
    responseData: Record<string, any>,
    status: number,
    startTime: [number, number]
  ): IntegrationLogger {
    const tracerId = <string>config.headers['x-tracer-id'];
    const applicationIdName = <string>config.headers['x-application-id-name'];
    const method = `${config.method?.toUpperCase()} ${config.url}`;
    return new IntegrationLogger(
      tracerId,
      applicationIdName,
      method,
      config.headers,
      config.params,
      config.data,
      responseData,
      status,
      startTime
    );
  }
}
