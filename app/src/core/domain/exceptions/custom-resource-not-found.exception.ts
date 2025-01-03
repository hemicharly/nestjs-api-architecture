import { AbstractBaseException } from '@core/domain/exceptions';
import { ErrorItemCoreEntity } from '@core/domain/entities/shared';

export class CustomResourceNotFoundException extends AbstractBaseException {
  constructor(protected readonly error: ErrorItemCoreEntity) {
    super(404, [error]);
  }
}
