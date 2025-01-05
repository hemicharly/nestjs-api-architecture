import { ValidationError } from 'class-validator';
import { AbstractBaseException } from '@core/domain/exceptions';

export class CustomValidationException extends AbstractBaseException {
  constructor(protected readonly validationErrors: ValidationError[]) {
    super(
      400,
      validationErrors.map((el) => {
        return {
          code: 'INVALID_FIELD',
          message: Object.values(el.constraints).join(', ')
        };
      })
    );
  }
}
