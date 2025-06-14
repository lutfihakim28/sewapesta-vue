export class Product {
  id: number;
  name: string;
  packageCount?: number;
  loading?: boolean;

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.packageCount = data.packageCount || 0;
    this.loading = data.loading
  }
}
