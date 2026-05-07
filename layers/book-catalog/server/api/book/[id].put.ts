import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'
import { bookUpdateSchema } from '~~/layers/shared/server/utils/validator'

const routeBodyValidator = bookUpdateSchema.clone()
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

  const routeBodyValidationResult = await readValidatedBody(event, routeBodyValidator.safeParse)

  if (!routeBodyValidationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: z.prettifyError(routeBodyValidationResult.error),
    })
  }

  const {
    name,
    description,
    summary,
    author,
    category,
    rating,
    totalBooks,
    availableBooks,
    imageUrl,
    videoUrl,
    coverColor,
  } = routeBodyValidationResult.data

  const [updatedBook] = await db
    .update(bookSchema)
    .set({
      name,
      description,
      summary,
      author,
      category,
      rating,
      totalBooks,
      availableBooks,
      imageUrl,
      videoUrl,
      coverColor,
    })
    .where(eq(bookSchema.id, id))
    .returning()

  if (!updatedBook) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found',
    })
  }

  return { updatedBook }
})
