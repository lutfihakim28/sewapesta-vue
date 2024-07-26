export class CategoryRequestDto {
  public name?: string;

  constructor(data?: CategoryRequestDto) {
    this.name = data?.name;
  }
}