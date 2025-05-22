export class Unit {
  id!: number;
  name!: string;

  constructor(data: Unit) {
    this.id = data.id;
    this.name = data.name;
  }
}