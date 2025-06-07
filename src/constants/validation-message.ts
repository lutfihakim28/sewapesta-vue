import { type EnumLike } from 'zod';

export const validationMessages = {
  required: (field: string) => `${field} is required.`,
  string: (field: string) => `${field} should be string.`,
  boolean: (field: string) => `${field} should be boolean value.`,
  number: (field: string) => `${field} should be valid number.`,
  integer: (field: string) => `${field} should be valid integer.`,
  numeric: (field: string) => `${field} should be numeric string.`,
  positiveNumber: (field: string) => `${field} should be valid positive number.`,
  nonNegativeNumber: (field: string) => `${field} should be valid non negative number.`,
  maxNumber: (field: string, max: number) => `Maximum ${field} is ${max}.`,
  minNumber: (field: string, min: number) => `Minimum ${field} is ${min}.`,
  minLength: (field: string, length: number) => `${field} should be minimum ${length} characters length.`,
  length: (field: string, length: number) => `${field} should be exactly has ${length} charactes length.`,
  maxLength: (field: string, length: number) => `${field} should be maximum ${length} characters length.`,
  enum: (field: string, enums: EnumLike) => `${field} should be one of [${Object.values(enums)}].`,
  array: (field: string) => `${field} should be an array.`
}