import { PaginationCoreEntity } from '@core/domain/entities/shared';

export class GenericPaginationCoreEntity<E> {
  constructor(
    readonly pagination: PaginationCoreEntity,
    readonly items: E[]
  ) {
    this.pagination = pagination || new PaginationCoreEntity(0, 0, 0);
    this.items = items || [];
  }
}
