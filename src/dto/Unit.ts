export class Unit {
  id: number;
  name: string;
  loading?: boolean;

  constructor(data: Unit) {
    this.id = data.id;
    this.name = data.name;
    this.loading = data.loading
  }
}
