import { ObjectSchema } from './utils/object'
import { StringSchema } from './utils/string'

export function generateLoginRequestSchema<T extends (value: string) => string>(t: T) {
  return new ObjectSchema({
    username: new StringSchema(t('field.Username')).getSchema(),
    password: new StringSchema(t('field.Password'))
      .getSchema()
  }).getSchema()
}
