export class Category {
  id!: number;
  name!: string;
  totalItems!: number;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
    this.totalItems = data.totalItems;
  }
}