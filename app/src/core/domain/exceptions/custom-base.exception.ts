import { ErrorItemCoreEntity } from '@core/domain/entities/common';

export abstract class CustomBaseException extends Error {
  protected constructor(
    public readonly statusCode: number,
    public readonly errors: ErrorItemCoreEntity[],
  ) {
    super(errors ? errors.map((e) => e.message).join(', ') : 'Internal Server Error');
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
