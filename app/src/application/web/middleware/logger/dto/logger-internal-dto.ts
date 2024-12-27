import { LoggerBaseDto } from '@application/web/middleware/logger/dto';

export class LoggerInternalDto extends LoggerBaseDto {
  constructor(startTime: [number, number], ip: string, useId: string, endpoint: string, headers: any, queryParameters: any, requestBody: any) {
    super(startTime, 'timesheet-in-transit-api', ip, useId, endpoint, headers, queryParameters, requestBody);
  }
}
