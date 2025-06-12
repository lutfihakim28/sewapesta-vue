import { ArraySchema } from './utils/array';
import { ObjectSchema } from './utils/object'
import { StringSchema } from './utils/string'
import type { SchemaType } from '@/types/schema';

export function generateCategoryRequestSchema<T extends (value: string, ...args: unknown[]) => string>(t: T) {
  return new ObjectSchema({
    names: new ArraySchema(t('field.Name', 2), new StringSchema(t('field.Name')).getSchema()).getSchema(),
  }).getSchema()
}

const schema = generateCategoryRequestSchema((v: string) => v);
export type CategoryRequest = SchemaType<typeof schema>
