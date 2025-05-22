import { ArraySchema } from './array';
import { ObjectSchema } from './object';
import { StringSchema } from './string';

export function SortSchema<T extends string>(columns: T[]) {
  return new ObjectSchema({
    asc: new ArraySchema('asc', new StringSchema('asc').getSchema()).getSchema()
      .optional(),
    desc: new ArraySchema('asc', new StringSchema('asc').getSchema()).getSchema()
      .optional(),
  })
    .getSchema()
}