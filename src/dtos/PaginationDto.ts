export class PaginationDto {
  public page!: number;
  public pageSize!: number;
  public pageCount!: number;

  constructor(data: PaginationDto) {
    this.page = data.page;
    this.pageCount = data.pageCount;
    this.pageSize = data.pageSize;
  }
}