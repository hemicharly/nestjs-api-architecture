import { PaginationCoreEntity } from '@core/domain/entities/common';

export class GenericPaginationCoreEntity<E> {
  constructor(
    readonly pagination: PaginationCoreEntity,
    readonly items: E[],
  ) {
    this.pagination = pagination || new PaginationCoreEntity(0, 0, 0);
    this.items = items || [];
  }
}
