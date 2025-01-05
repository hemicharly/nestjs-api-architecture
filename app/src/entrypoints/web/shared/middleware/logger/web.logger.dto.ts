export class WebLoggerDto {
  readonly tracerId: string;
  readonly timestamp: string;
  readonly application: string;
  readonly ip: string;
  readonly useId: string;
  readonly endpoint: string;
  readonly headers: Record<string, any>;
  readonly queryParameters: Record<string, any>;
  readonly requestBody: Record<string, any>;
  responseBody: Record<string, any>;
  statusCode: number;
  duration: number;
  startTime?: [number, number];

  constructor(
    tracerId: string,
    startTime: [number, number],
    ip: string,
    useId: string,
    endpoint: string,
    headers: Record<string, any>,
    queryParameters: Record<string, any>,
    requestBody: Record<string, any>
  ) {
    this.tracerId = tracerId;
    this.timestamp = new Date().toJSON();
    this.application = 'timesheet-in-transit-api';
    this.ip = ip;
    this.useId = useId;
    this.endpoint = endpoint;
    this.headers = this.maskSensitiveFields(headers);
    this.queryParameters = this.maskSensitiveFields(queryParameters);
    this.requestBody = this.maskSensitiveFields(requestBody);
    this.responseBody = {};
    this.statusCode = 0;
    this.duration = 0;
    this.startTime = startTime;
  }

  private maskSensitiveFields(obj: Record<string, any>): Record<string, any> {
    if (!obj || Object.keys(obj).length === 0) {
      return {};
    }

    const sensitiveFields = new Set([
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

    const maskedObj = { ...obj };

    for (const key in maskedObj) {
      if (sensitiveFields.has(key)) {
        maskedObj[key] = '****';
      }
    }

    return maskedObj;
  }
}
