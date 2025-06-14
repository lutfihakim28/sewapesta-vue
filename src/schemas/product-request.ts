import { generateCategoryRequestSchema, type CategoryRequest } from './category-request';

export const generateProductRequestSchema = generateCategoryRequestSchema

export type ProductRequest = CategoryRequest
