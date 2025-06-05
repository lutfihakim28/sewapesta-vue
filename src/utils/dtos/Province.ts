import type { Location } from '../interfaces/Location';

export class Province implements Location {
  constructor(
    public name: string,
    public code: string,
  ) { }
}