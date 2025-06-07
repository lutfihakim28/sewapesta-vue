import { ItemTypeEnum } from '../enums/item-type';
import { EnumSchema } from './utils/enum';
import { PaginationSchema } from './utils/pagination';
import { SearchSchema } from './utils/search';
import { SortSchema } from './utils/sort';
import type { SchemaType } from '../types/schema';
import { NumberSchema } from './utils/number';

export const ItemFilterSchema = SearchSchema
  .merge(SortSchema(['id',
    'name',
    'type']))
  .merge(PaginationSchema)
  .extend({
    type: new EnumSchema('Type', ItemTypeEnum).getSchema().optional(),
    categoryId: new NumberSchema('Category ID').positive().integer().getSchema().optional(),
  })

export type ItemFilter = SchemaType<typeof ItemFilterSchema>
