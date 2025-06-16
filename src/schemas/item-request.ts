import { ItemTypeEnum } from '@/enums/item-type';
import { EnumSchema } from './utils/enum';
import { ObjectSchema } from './utils/object'
import { StringSchema } from './utils/string'
import type { SchemaType } from '@/types/schema';
import { NumberSchema } from './utils/number';

export function generateItemRequestSchema<T extends (value: string, ...args: unknown[]) => string>(t: T) {
  return new ObjectSchema({
    name: new StringSchema(t('field.Name')).getSchema(),
    type: new EnumSchema(t('field.Type'), ItemTypeEnum).getSchema(),
    unitId: new NumberSchema(t('field.entity-ID', { entity: t('Unit') })).natural().getSchema(),
    categoryId: new NumberSchema(t('field.entity-ID', { entity: t('Category') })).natural().getSchema(),
  }).getSchema()
}

const schema = generateItemRequestSchema((v: string) => v);
export type ItemRequest = Partial<SchemaType<typeof schema>>
