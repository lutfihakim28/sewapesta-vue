import type { Location } from '../interfaces/Location';

export class City implements Location {
  constructor(
    public name: string,
    public code: string,
    public provinceCode: string,
  ) { }
}