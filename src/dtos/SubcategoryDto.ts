import { BaseDto } from './BaseDto';

export class SubcategoryDto extends BaseDto {
  public name!: string;

  constructor(data: SubcategoryDto) {
    super(data);
    this.name = data.name;
  }
}