import { CustomBaseException } from '@core/domain/exceptions';

export class CustomUnauthorizedException extends CustomBaseException {
  constructor() {
    super(401, [{ code: '401', message: 'Unauthorized' }]);
  }
}
