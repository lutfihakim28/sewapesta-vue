import { ObjectSchema } from './utils/object'
import { StringSchema } from './utils/string'

export function generateCategoryRequestSchema<T extends (value: string) => string>(t: T) {
  return new ObjectSchema({
    name: new StringSchema(t('field.Name')).getSchema(),
  }).getSchema()
}
