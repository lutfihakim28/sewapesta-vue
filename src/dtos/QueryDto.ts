export class QueryDto {
  public page!: number;
  public pageSize!: number;
  public keyword?: string;
  public sort?: 'asc' | 'desc';
  public sortBy?: string;
  public startAt?: number;
  public endAt?: number;

  constructor(data: QueryDto) {
    this.endAt = data.endAt;
    this.keyword = data.keyword;
    this.pageSize = data.pageSize;
    this.page = data.page;
    this.sort = data.sort;
    this.sortBy = data.sortBy;
    this.startAt = data.startAt;
  }
}