import { desc, sql } from 'drizzle-orm'
import { getServerSession } from '~~/layers/auth/server/utils/session'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'

export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event)
    const isFeatured = query.featured === 'true'
    const isPopular = query.sort === 'popular'

    if (isFeatured) {
      const [featuredBook] = await db
        .select()
        .from(bookSchema)
        .orderBy(sql`RANDOM()`)
        .limit(1)

      if (!featuredBook) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Book not found',
        })
      }

      return { featuredBook }
    }

    if (isPopular) {
      const popularBooks = await db
        .select()
        .from(bookSchema)
        .orderBy(desc(bookSchema.rating), desc(bookSchema.createdAt))
        .limit(10)

      return { popularBooks }
    }

    await getServerSession(event)

    const data = await db.select().from(bookSchema)

    return data
  },
  {
    maxAge: 10,
    swr: false,
  },
)
