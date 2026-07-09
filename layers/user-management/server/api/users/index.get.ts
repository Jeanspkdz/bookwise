import { and, asc, eq, ilike, or } from 'drizzle-orm'
import { z } from 'zod'
import { getServerSession } from '~~/layers/auth/server/utils/session'
import { user } from '~~/layers/shared/server/db/schema/auth.schema'

const routeQueryValidator = z.object({
  approvalStatus: z.enum(['all', 'approved', 'pending']).default('all'),
  role: z.enum(['admin', 'student']).optional(),
  search: z.string().trim().min(1).optional(),
})

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  const routeQueryValidationResult = await getValidatedQuery(event, routeQueryValidator.safeParse)

  if (!routeQueryValidationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query params',
      data: z.prettifyError(routeQueryValidationResult.error),
    })
  }

  const { approvalStatus, role, search } = routeQueryValidationResult.data
  const filters = []

  if (approvalStatus === 'pending') {
    filters.push(eq(user.isApproved, false))
  }

  if (approvalStatus === 'approved') {
    filters.push(eq(user.isApproved, true))
  }

  if (role) {
    filters.push(eq(user.role, role))
  }

  if (search) {
    const searchTerm = `%${search}%`
    filters.push(
      or(
        ilike(user.name, searchTerm),
        ilike(user.email, searchTerm),
        ilike(user.studentCode, searchTerm),
      ),
    )
  }

  return await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      dateJoined: user.createdAt,
      universityId: user.studentCode,
      isApproved: user.isApproved,
      role: user.role,
    })
    .from(user)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(user.createdAt))
})
