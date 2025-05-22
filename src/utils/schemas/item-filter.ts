import { ItemTypeEnum } from '../enums/item-type';
import { EnumSchema } from './utils/enum';
import { PaginationSchema } from './utils/pagination';
import { SearchSchema } from './utils/search';
import { SortSchema } from './utils/sort';
import { StringSchema } from './utils/string';
import type { SchemaType } from '../types/schema';

export const ItemFilterSchema = SearchSchema
  .merge(SortSchema(['id',
    'name',
    'type']))
  .merge(PaginationSchema)
  .extend({
    type: new EnumSchema('Type', ItemTypeEnum).getSchema().optional(),
    categoryId: new StringSchema('Product ID').numeric({ min: 1, subset: 'natural' }).getSchema().optional(),
  })

export type ItemFilter = SchemaType<typeof ItemFilterSchema>