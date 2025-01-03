import { AbstractBaseException } from '@core/domain/exceptions';

export class CustomForbiddenException extends AbstractBaseException {
  constructor() {
    super(403, [{ code: '403', message: 'Access denied' }]);
  }
}
