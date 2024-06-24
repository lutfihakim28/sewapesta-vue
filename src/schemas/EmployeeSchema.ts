import { z } from 'zod';
import { BaseResponseSchema } from './BaseResponseSchema';
import { MetaSchema } from './MetaSchema';
import { validationMessages } from '@/constants/validationMessages';
import { SortSchema } from './SortSchema';
import { SearchSchema } from './SearchSchema';
import { PaginationSchema } from './PaginationSchema';

export const EmployeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string(),
})

export const ListEmployeeResponseSchema = BaseResponseSchema.extend({
  data: z.array(EmployeeSchema),
  meta: MetaSchema
})

export const DetailEmployeeResponseSchema = BaseResponseSchema.extend({
  data: EmployeeSchema,
})

export const EmployeeRequestSchema = z.object({
  name: z.string({ message: validationMessages.required('Nama karyawan') }),
  phone: z
    .string({ message: validationMessages.required('Nomor HP') })
    .min(13, { message: validationMessages.minLength('Nomor HP', 13) }),
})

export const EmployeeFilterSchema = SortSchema(['name'])
  .merge(SearchSchema)
  .merge(PaginationSchema)

export type Employee = z.infer<typeof EmployeeSchema>
export type ListEmployeeResponse = z.infer<typeof ListEmployeeResponseSchema>
export type DetailEmployeeResponse = z.infer<typeof DetailEmployeeResponseSchema>
export type EmployeeRequest = z.infer<typeof EmployeeRequestSchema>
export type EmployeeFilter = z.infer<typeof EmployeeFilterSchema>