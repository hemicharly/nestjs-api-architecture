import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CustomBaseException } from '@core/domain/exceptions';

@Catch(CustomBaseException, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: CustomBaseException | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof CustomBaseException) {
      response.status(exception.statusCode).json({ errors: exception.errors });
      return;
    }

    this.logger.error(exception);

    response.status(500).json({
      errors: [
        {
          code: 'INTERNAL_SERVICE',
          message: 'Internal Server Error',
        },
      ],
    });
  }
}
