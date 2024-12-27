import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { CustomValidationException } from '@application/web/exceptions';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => new CustomValidationException(errors),
    });
  }
}
