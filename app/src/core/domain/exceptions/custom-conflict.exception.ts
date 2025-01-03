import { AbstractBaseException } from '@core/domain/exceptions';
import { ErrorItemCoreEntity } from '@core/domain/entities/shared';

export class CustomConflictException extends AbstractBaseException {
  constructor(protected readonly error: ErrorItemCoreEntity) {
    super(409, [error]);
  }
}
