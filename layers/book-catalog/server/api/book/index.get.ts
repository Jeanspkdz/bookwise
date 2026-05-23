import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'
import { getServerSession } from '~~/layers/auth/server/utils/session'

export default defineEventHandler(async (e) => {
  await getServerSession(e)

  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })

  const data = await db.select().from(bookSchema)
  return data
})
