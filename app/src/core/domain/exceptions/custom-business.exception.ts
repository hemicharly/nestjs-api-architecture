import { AbstractBaseException } from '@core/domain/exceptions';
import { ErrorItemCoreEntity } from '@core/domain/entities/shared';

export class CustomBusinessException extends AbstractBaseException {
  constructor(protected readonly error: ErrorItemCoreEntity) {
    super(400, [error]);
  }
}
