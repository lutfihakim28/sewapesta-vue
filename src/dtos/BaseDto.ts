export class BaseDto {
  public id!: number;
  public createdAt?: string;
  public updatedAt?: string;

  constructor(data: BaseDto) {
    this.createdAt = data.createdAt;
    this.id = data.id;
    this.updatedAt = data.updatedAt;
  }
}