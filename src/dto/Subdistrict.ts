import type { Location } from '../interfaces/Location';

export class Subdistrict implements Location {
  constructor(
    public name: string,
    public code: string,
    public districtCode: string,
  ) { }
}