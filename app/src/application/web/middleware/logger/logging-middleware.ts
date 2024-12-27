import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerInternalDto } from '@application/web/middleware/logger/dto';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly IGNORE_ROUTES = new Set(['/favicon.ico', '/swagger-doc', '/health']);
  private readonly logger = new Logger(LoggingMiddleware.name);

  public use(req: Request, res: Response, next: NextFunction): void {
    if (!this.shouldIgnoreRoute(req.originalUrl)) {
      const startTime: [number, number] = process.hrtime();
      this.attachResponseHandlers(req, res, startTime);
    }
    next();
  }

  private shouldIgnoreRoute(url: string): boolean {
    return this.IGNORE_ROUTES.has(url);
  }

  private attachResponseHandlers(req: Request, res: Response, startTime: [number, number]): void {
    let responseBody: any = null;
    const oldSend = res.send;

    res.send = (data: any) => {
      responseBody = data;
      res.send = oldSend;
      return res.send(data);
    };

    let isCloseRequest = false;

    res.on('finish', () => {
      isCloseRequest = true;
      this.logRequest(startTime, req, res, responseBody, isCloseRequest);
    });

    res.on('close', () => {
      if (!isCloseRequest) {
        responseBody = 'Client closed request';
        this.logRequest(startTime, req, res, responseBody, isCloseRequest);
      }
    });
  }

  private logRequest(startTime: [number, number], req: Request, res: Response, responseBody: any, isCloseRequest: boolean): void {
    const logEntry = this.createLogEntry(startTime, req, res, responseBody, isCloseRequest);
    if (logEntry.statusCode >= 400) {
      this.logger.error(JSON.stringify(logEntry));
      return;
    }
    this.logger.log(JSON.stringify(logEntry));
  }

  private createLogEntry(startTime: [number, number], req: Request, res: Response, responseBody: any, isCloseRequest: boolean): LoggerInternalDto {
    const loggerInternal = new LoggerInternalDto(startTime, req.ip, req.userId, `${req.method} ${req.originalUrl}`, req.headers, req.query, req.body);
    loggerInternal.duration = this.elapsedTime(startTime);
    loggerInternal.startTime = undefined;
    loggerInternal.statusCode = isCloseRequest ? res.statusCode : 499;

    if (loggerInternal.statusCode < 204 && responseBody) {
      loggerInternal.responseBody = req.method !== 'GET' ? this.safeParseJson(responseBody) : {};
      return loggerInternal;
    }

    loggerInternal.responseBody = this.safeParseJson(responseBody);
    return loggerInternal;
  }

  private safeParseJson(data: any): any {
    try {
      return data && !(data instanceof String) ? JSON.parse(data) : {};
    } catch {
      return data;
    }
  }

  private elapsedTime(startTime: [number, number]): number {
    const elapsedHrTime: [number, number] = process.hrtime(startTime);
    const elapsedTimeMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    return parseFloat(elapsedTimeMs.toFixed(3));
  }
}
