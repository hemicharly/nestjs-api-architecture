import { CustomBaseException } from '@core/domain/exceptions';
import { ErrorItemCoreEntity } from '@core/domain/entities/common';

export class CustomResourceNotFoundException extends CustomBaseException {
  constructor(protected readonly error: ErrorItemCoreEntity) {
    super(404, [error]);
  }
}
