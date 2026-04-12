import { createSelectSchema } from 'drizzle-orm/zod'
import { z } from 'zod'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'
export const bookSelectSchema = createSelectSchema(bookSchema)
