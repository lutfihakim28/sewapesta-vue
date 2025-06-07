export class Product {
  id: number;
  name: string;
  packageCount: number;

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.packageCount = data.packageCount;
  }
}
