import { CustomBaseException } from '@core/domain/exceptions';
import { ErrorItemCoreEntity } from '@core/domain/entities/shared';

export class CustomBusinessException extends CustomBaseException {
  constructor(protected readonly error: ErrorItemCoreEntity) {
    super(400, [error]);
  }
}
