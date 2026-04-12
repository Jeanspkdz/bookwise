import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'

export default defineEventHandler(async (e) => {
  const data = await db.select().from(bookSchema)
  return data
})
