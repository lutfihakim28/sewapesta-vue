import { formatCurrency } from '@/helpers/currency';
import { Product } from './Product';

export class Package {
  id: number;
  name: string;
  price: number;
  product: Product;

  constructor(data: Package) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.product = new Product(data.product);
  }

  get formattedPrice() {
    return formatCurrency(this.price);
  }
}
