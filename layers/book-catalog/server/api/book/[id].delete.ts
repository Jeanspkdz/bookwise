import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getServerSession } from '~~/layers/auth/server/utils/session'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'

const routeParamValidator = z.object({
  id: z.string().min(1, { error: 'Book id is required' }),
})

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

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

  const [deletedBook] = await db.delete(bookSchema).where(eq(bookSchema.id, id)).returning()

  if (!deletedBook) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found',
    })
  }

  return { deletedBook }
})
