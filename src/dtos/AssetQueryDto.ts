import { QueryDto } from './QueryDto';

export class AssetQueryDto extends QueryDto {
  public subcategories?: string;

  constructor(data: AssetQueryDto) {
    super(data);
    this.subcategories = data.subcategories;
  }
}