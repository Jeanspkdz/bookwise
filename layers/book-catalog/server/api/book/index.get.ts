import { desc, sql } from 'drizzle-orm'
import { z } from 'zod'
import { getServerSession } from '~~/layers/auth/server/utils/session'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'

const routeQueryValidator = z.object({
  featured: z.stringbool().optional(),
  sort: z.literal('popular').optional(),
})

export default defineCachedEventHandler(
  // export default defineEventHandler(
  async (event) => {
    const routeQueryValidationResult = await getValidatedQuery(event, routeQueryValidator.safeParse)

    if (!routeQueryValidationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid query params',
        data: z.prettifyError(routeQueryValidationResult.error),
      })
    }

    const { featured, sort } = routeQueryValidationResult.data
    const isFeatured = featured === true
    const isPopular = sort === 'popular'

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
    maxAge: 30,
    swr: false,
    staleMaxAge: 15,
    name: 'get-books',
    varies: ['cookie'],
    getKey(event) {
      const url = getRequestURL(event)
      const query = new URLSearchParams(url.searchParams)
      query.sort()
      return `books:${query.toString() || 'all'}`
    },
    shouldBypassCache(event) {
      return getHeader(event, 'bookwise-dashboard-request') === 'true'
    },
  },
)
