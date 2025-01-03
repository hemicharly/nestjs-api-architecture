import { AbstractBaseException } from '@core/domain/exceptions';

export class CustomUnauthorizedException extends AbstractBaseException {
  constructor() {
    super(401, [{ code: '401', message: 'Unauthorized' }]);
  }
}
