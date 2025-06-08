import type { Location } from '../interfaces/Location';

export class District implements Location {
  constructor(
    public name: string,
    public code: string,
    public cityCode: string,
  ) { }
}