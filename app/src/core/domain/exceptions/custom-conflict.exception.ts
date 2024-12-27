import { CustomBaseException } from '@core/domain/exceptions';
import { ErrorItemCoreEntity } from '@core/domain/entities/common';

export class CustomConflictException extends CustomBaseException {
  constructor(protected readonly error: ErrorItemCoreEntity) {
    super(409, [error]);
  }
}
