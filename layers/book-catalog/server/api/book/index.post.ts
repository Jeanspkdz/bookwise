import { z } from 'zod'
import { getServerSession } from '~~/layers/auth/server/utils/session'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'
import { bookInsertSchema } from '~~/layers/shared/server/utils/validator'

const routeBodyValidator = bookInsertSchema.clone()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

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

  const [createdBook] = await db
    .insert(bookSchema)
    .values({
      name,
      description,
      summary,
      author,
      category,
      rating: rating ?? 0,
      totalBooks,
      availableBooks: availableBooks ?? totalBooks,
      imageUrl,
      videoUrl,
      coverColor,
    })
    .returning()

  if (!createdBook) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book Creation Failed',
    })
  }

  setResponseStatus(event, 201)

  return { createdBook }
})
