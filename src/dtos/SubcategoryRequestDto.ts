export class SubcategoryRequestDto {
  public name?: string;
  public categoryId?: number;

  constructor(data?: SubcategoryRequestDto) {
    this.name = data?.name;
    this.categoryId = data?.categoryId
  }
}