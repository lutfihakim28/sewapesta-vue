import { generateCategoryRequestSchema, type CategoryRequest } from './category-request';

export const generateUnitRequestSchema = generateCategoryRequestSchema

export type UnitRequest = CategoryRequest
