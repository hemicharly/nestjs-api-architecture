import { CustomBusinessException } from '@core/domain/exceptions';
import { CodeError } from '@core/domain/exceptions/error';

export class ValidateDatesCoreEntity {
  public static validateBetweenDates(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new CustomBusinessException(CodeError.INVALID_BETWEEN_DATES);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!(start <= end)) {
      throw new CustomBusinessException(CodeError.START_DATE_GREATER_THAN_END_DATE);
    }
  }
}
