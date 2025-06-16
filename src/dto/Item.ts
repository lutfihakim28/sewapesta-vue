import { ItemTypeEnum } from '../enums/item-type';
import { Category } from './Category';
import { Unit } from './Unit';

export class Item {
  id: number;
  name: string;
  type: ItemTypeEnum;
  unit: Unit;
  category: Category;
  loading?: boolean

  constructor(data: Item) {
    this.id = data.id;
    this.name = data.name;
    this.type = ItemTypeEnum[data.type];
    this.unit = new Unit(data.unit)
    this.category = new Category(data.category)
    this.loading = data.loading
  }
}
