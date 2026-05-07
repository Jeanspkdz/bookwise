import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/zod'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'

export const bookSelectSchema = createSelectSchema(bookSchema)
export const bookInsertSchema = createInsertSchema(bookSchema)
export const bookUpdateSchema = createUpdateSchema(bookSchema)
