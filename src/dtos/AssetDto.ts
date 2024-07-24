import { formatter } from '@/utils/formatter';
import { BaseDto } from './BaseDto';
import { OwnerDto } from './OwnerDto';
import { SubcategoryDto } from './SubcategoryDto';
import { UnitDto } from './UnitDto';
import { ImageDto } from './ImageDto';

class Quantity {
  public damaged!: number;
  public used!: number;
  public available!: number;
  public total!: number;

  constructor(data: Quantity) {
    this.damaged = data.damaged;
    this.used = data.used;
    this.available = data.available;
    this.total = data.total;
  }
}

export class AssetDto extends BaseDto {
  public name!: string;
  public price!: number;
  public images!: Array<ImageDto>
  public quantity!: Quantity;
  public owner!: OwnerDto;
  public subcategory!: SubcategoryDto;
  public unit!: UnitDto;
  public hasOvertime!: boolean;

  constructor(data: AssetDto) {
    super(data)
    this.name = data.name;
    this.price = data.price;
    this.images = data.images.map((_data) => new ImageDto(_data));
    this.quantity = new Quantity(data.quantity);
    this.owner = new OwnerDto(data.owner);
    this.subcategory = new SubcategoryDto(data.subcategory);
    this.unit = new UnitDto(data.unit);
    this.hasOvertime = data.hasOvertime;
  }

  public get _price() {
    const formatted = formatter.currency(this.price).value;
    return `${formatted},-`;
  }
}