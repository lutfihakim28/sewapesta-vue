import { ObjectSchema } from './utils/object'
import { StringSchema } from './utils/string'
import type { SchemaType } from '@/types/schema';

export function generateCategoryRequestSchema<T extends (value: string) => string>(t: T) {
  return new ObjectSchema({
    name: new StringSchema(t('field.Name')).min(1).getSchema(),
  }).getSchema()
}

const schema = generateCategoryRequestSchema((v: string) => v);
export type CategoryRequest = SchemaType<typeof schema>
