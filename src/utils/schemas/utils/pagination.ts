import { NumberSchema } from './number';
import { ObjectSchema } from './object';

export const PaginationSchema = new ObjectSchema({
  page: new NumberSchema('Product ID').integer().getSchema().optional(),
  pageSize: new NumberSchema('Product ID').integer().getSchema().optional(),
}).getSchema()