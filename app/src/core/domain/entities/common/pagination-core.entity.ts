export class PaginationCoreEntity {
  constructor(
    readonly page: number,
    readonly pageSize: number,
    readonly total?: number,
  ) {
    this.page = page || 0;
    this.pageSize = pageSize || 50;
    this.total = total || 0;
  }
}
