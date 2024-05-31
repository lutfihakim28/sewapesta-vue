import { validationMessages } from '@/constants/validationMessages';
import { employeesTable } from '@/db/schema/employees';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const EmployeeRequestSchema = createInsertSchema(employeesTable, {
  name: z.string({ message: validationMessages.required('Nama karyawan') }).openapi({ example: 'Budi' }),
  phone: z.string({ message: validationMessages.required('Nomor HP') }).openapi({ example: '628123242312' }),
}).pick({
  name: true,
  phone: true,
}).openapi('EmployeeRequest')

export type EmployeeRequest = z.infer<typeof EmployeeRequestSchema>