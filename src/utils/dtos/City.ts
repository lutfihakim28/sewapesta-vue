import type { Location } from '../interfaces/Location';

export class City implements Location {
  public name: string;
  public code: string;
  public provinceCode: string;

  constructor(
    data: City
  ) {
    this.code = data.code
    this.name = data.name
    this.provinceCode = data.provinceCode
  }
}
