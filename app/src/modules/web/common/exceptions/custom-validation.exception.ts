import { ValidationError } from 'class-validator';
import { CustomBaseException } from '@core/domain/exceptions';

export class CustomValidationException extends CustomBaseException {
  constructor(protected readonly validationErrors: ValidationError[]) {
    super(
      400,
      validationErrors.map((el) => {
        return {
          code: 'INVALID_FIELD',
          message: Object.values(el.constraints).join(', '),
        };
      }),
    );
  }
}
