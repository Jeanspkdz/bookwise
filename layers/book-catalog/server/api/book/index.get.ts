import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'

export default defineEventHandler(async (e) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })

  const data = await db.select().from(bookSchema)
  return data
})
