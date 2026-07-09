import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getServerSession } from '~~/layers/auth/server/utils/session'
import { user } from '~~/layers/shared/server/db/schema/auth.schema'

const routeParamValidator = z.object({
  id: z.string().min(1, { error: 'User id is required' }),
})

const routeBodyValidator = z.object({
  isApproved: z.boolean(),
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

  const routeBodyValidationResult = await readValidatedBody(event, routeBodyValidator.safeParse)

  if (!routeBodyValidationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: z.prettifyError(routeBodyValidationResult.error),
    })
  }

  const { id } = routeParamValidationResult.data
  const { isApproved } = routeBodyValidationResult.data

  const [updatedUser] = await db
    .update(user)
    .set({
      isApproved,
    })
    .where(eq(user.id, id))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      dateJoined: user.createdAt,
      universityId: user.studentCode,
      isApproved: user.isApproved,
      role: user.role,
    })

  if (!updatedUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return { updatedUser }
})
