import { asc, countDistinct, sql } from 'drizzle-orm'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'
import {
  getPaginationParams,
  paginationQuerySchema,
} from '~~/layers/shared/server/utils/pagination'
import { createPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

export default defineEventHandler(async (event) => {
  const result = await getValidatedQuery(event, paginationQuerySchema.safeParse)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid pagination parameters' })
  }

  const { page, pageSize } = result.data
  const { limit, offset } = getPaginationParams({ page, pageSize })
  const where = sql`trim(${bookSchema.category}) <> ''`
  const [countRows, categories] = await Promise.all([
    db
      .select({ totalItems: countDistinct(bookSchema.category) })
      .from(bookSchema)
      .where(where),
    db
      .selectDistinct({ category: bookSchema.category })
      .from(bookSchema)
      .where(where)
      .orderBy(asc(bookSchema.category))
      .limit(limit)
      .offset(offset),
  ])

  return createPaginatedResponse(categories, countRows[0]?.totalItems ?? 0, { page, pageSize })
})
