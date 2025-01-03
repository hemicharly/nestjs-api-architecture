import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AbstractBaseException } from '@core/domain/exceptions';

@Catch(AbstractBaseException, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: AbstractBaseException | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AbstractBaseException) {
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
