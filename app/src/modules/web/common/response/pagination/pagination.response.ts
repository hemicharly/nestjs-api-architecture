import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse {
  @ApiProperty({ description: 'Page number.', example: 0 })
  readonly page: number;

  @ApiProperty({ description: 'Page size.', example: 10 })
  readonly pageSize: number;

  @ApiProperty()
  readonly total: number;

  constructor(page: number, pageSize: number, total: number) {
    this.page = page ? Number(page) : 0;
    this.pageSize = pageSize ? Number(pageSize) : 0;
    this.total = total ? Number(total) : 0;
  }
}
