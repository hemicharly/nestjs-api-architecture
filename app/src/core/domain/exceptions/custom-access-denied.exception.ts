import { CustomBaseException } from '@core/domain/exceptions';

export class CustomAccessDeniedException extends CustomBaseException {
  constructor() {
    super(403, [{ code: '403', message: 'Access denied' }]);
  }
}
