import { and, eq } from 'drizzle-orm'
import type { H3Event } from 'h3'
import { z } from 'zod'
import { getServerSession } from '~~/layers/auth/server/utils/session'
import { user } from '~~/layers/shared/server/db/schema/auth.schema'

export async function updateAccountStatus(event: H3Event, status: 'approved' | 'rejected') {
  const session = await getServerSession(event)

  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const result = await getValidatedRouterParams(
    event,
    (value) => z.object({ id: z.string().min(1) }).safeParse(value),
  )

  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid route params' })
  }
  const { id } = result.data

  const [updatedUser] = await db
    .update(user)
    .set({ status })
    .where(and(eq(user.id, id), eq(user.status, 'pending')))
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      dateJoined: user.createdAt,
      universityId: user.studentCode,
      status: user.status,
      role: user.role,
    })

  if (!updatedUser) {
    throw createError({ statusCode: 409, statusMessage: 'Account is not pending' })
  }

  return { updatedUser }
}
