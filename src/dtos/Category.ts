export class Category {
  id: number;
  name: string;
  itemCount: number;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
    this.itemCount = data.itemCount;
  }
}
