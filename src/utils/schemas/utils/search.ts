import { ObjectSchema } from './object';
import { StringSchema } from './string';

export const SearchSchema = new ObjectSchema({
  keyword: new StringSchema('Keyword').min(3).getSchema().optional(),
}).getSchema()
