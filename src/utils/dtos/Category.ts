export class Category {
  id!: number;
  name!: string;

  constructor(data: Category) {
    // const _data = data as Category;
    this.id = data.id;
    this.name = data.name
  }
}