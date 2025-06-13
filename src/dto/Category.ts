export class Category {
  id: number;
  name: string;
  itemCount?: number;
  loading?: boolean;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
    this.itemCount = data.itemCount || 0;
    this.loading = data.loading || false;
  }
}
