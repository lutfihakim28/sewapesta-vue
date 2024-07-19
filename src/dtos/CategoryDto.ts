import { BaseDto } from './BaseDto';
import { SubcategoryDto } from './SubcategoryDto';

export class CategoryDto extends BaseDto {
  public name!: string;
  public subcategories!: Array<SubcategoryDto>

  constructor(data: CategoryDto) {
    super(data);
    this.name = data.name;
    this.subcategories = data.subcategories.map((_data) => new SubcategoryDto(_data))
  }
}