import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'

const routeParamValidator = z.object({
  id: z.string().min(1, { error: 'Book id is required' }),
})

export default defineEventHandler(async (event) => {
  const routeParamValidationResult = await getValidatedRouterParams(
    event,
    routeParamValidator.safeParse,
  )

  if (!routeParamValidationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid route params',
      data: z.prettifyError(routeParamValidationResult.error),
    })
  }

  const { id } = routeParamValidationResult.data

  const [book] = await db.select().from(bookSchema).where(eq(bookSchema.id, id)).limit(1)

  if (!book) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found',
    })
  }

  return book
})
