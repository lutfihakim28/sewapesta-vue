import { validationMessages } from '@/constants/validationMessages';
import { accountMutationsTable } from '@/db/schema/accountMutations';
import { accountsTable } from '@/db/schema/accounts';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountRequestSchema = createInsertSchema(accountsTable, {
  name: z.string({
    message: validationMessages.required('Nama'),
  }).openapi({
    example: 'Budi',
  })
}).pick({ name: true }).openapi('AccountRequest')

export const AccountUpdateSchema = createInsertSchema(accountsTable, {
  balance: z.number({
    message: 'Saldo akun harus diisi.'
  })
}).pick({ balance: true })

export type AccountRequest = z.infer<typeof AccountRequestSchema>
export type AccountUpdate = z.infer<typeof AccountUpdateSchema>