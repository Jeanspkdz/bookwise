import { count, sql } from 'drizzle-orm'
import { z } from 'zod'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'
import {
  getPaginationParams,
  paginationQuerySchema,
} from '~~/layers/shared/server/utils/pagination'
import { createPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

import { BookQueryBuilder, sortableBookFieldSchema } from '../../utils/book-query'

const routeQueryValidator = z
  .object({
    featured: z.stringbool().default(false),
    sort: sortableBookFieldSchema.default('createdAt'),
    order: z.enum(['asc', 'desc']).default('asc'),
    category: z.string().trim().min(1).optional(),
    exclude: z.string().optional(),
    search: z.string().trim().max(200).optional(),
    searchBy: z.enum(['all', 'name', 'author', 'category']).default('all'),
  })
  .extend(paginationQuerySchema.shape)

export default defineCachedEventHandler(
  async (event) => {
    const result = await getValidatedQuery(event, routeQueryValidator.safeParse)

    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid query params',
        data: z.prettifyError(result.error),
      })
    }

    const { featured, category, exclude, page, pageSize, sort, order, search, searchBy } =
      result.data
    const { limit, offset } = getPaginationParams({ page, pageSize })
    const query = new BookQueryBuilder()
      .search(search, searchBy)
      .category(category)
      .exclude(exclude)
      .sortBy(sort, order)
      .build()

    if (featured) {
      const [featuredBook] = await db
        .select()
        .from(bookSchema)
        .where(query.where)
        .orderBy(sql`RANDOM()`)
        .limit(1)

      if (!featuredBook) {
        throw createError({ statusCode: 404, statusMessage: 'Book not found' })
      }

      return { featuredBook }
    }

    const [countRows, books] = await Promise.all([
      db.select({ totalItems: count() }).from(bookSchema).where(query.where),
      db
        .select()
        .from(bookSchema)
        .where(query.where)
        .orderBy(...query.orderBy)
        .limit(limit)
        .offset(offset),
    ])

    return createPaginatedResponse(books, countRows[0]?.totalItems ?? 0, { page, pageSize })
  },
  {
    maxAge: 10,
    swr: true,
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
      return getHeader(event, 'bookwise-bypass-cache') === 'true'
    },
  },
)
