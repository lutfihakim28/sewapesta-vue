import { ObjectSchema } from './utils/object'
import { StringSchema } from './utils/string'
// import type { SchemaType } from '../types/schema'
// import { i18n } from '@/i18n'
// import type { Composer } from 'vue-i18n'

export function generateLoginRequestSchema<T extends (value: string) => string>(t: T) {
  // const { t } = i18n.global as Composer

  return new ObjectSchema({
    username: new StringSchema(t('field.Username')).getSchema(),
    password: new StringSchema(t('field.Password'))
      .getSchema()
  }).getSchema()
}

// const { t } = i18n.global as Composer

// export const LoginRequestSchema = new ObjectSchema({
//   username: new StringSchema(t('field.Username')).getSchema(),
//   password: new StringSchema(t('field.Password'))
//     .getSchema()
// }).getSchema()

// export type LoginRequest = SchemaType<typeof LoginRequestSchema>
