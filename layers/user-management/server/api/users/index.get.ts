import { and, asc, count, eq, ilike, or } from 'drizzle-orm'
import { z } from 'zod'
import { getServerSession } from '~~/layers/auth/server/utils/session'
import { user } from '~~/layers/shared/server/db/schema/auth.schema'
import {
  createPaginatedResponse,
  getPaginationParams,
  paginationQuerySchema,
} from '~~/layers/shared/server/utils/pagination'

const routeQueryValidator = z
  .object({
    status: z.enum(['all', 'pending', 'approved', 'rejected']).default('all'),
    role: z.enum(['admin', 'student']).optional(),
    search: z.string().trim().min(1).optional(),
  })
  .extend(paginationQuerySchema.shape)

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

  const { status, role, search, page, pageSize } = routeQueryValidationResult.data
  const { limit, offset } = getPaginationParams({ page, pageSize })
  const filters = []

  if (status !== 'all') {
    filters.push(eq(user.status, status))
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

  const where = filters.length ? and(...filters) : undefined
  const [countRows, users] = await Promise.all([
    db.select({ totalItems: count() }).from(user).where(where),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        dateJoined: user.createdAt,
        universityId: user.studentCode,
        phoneNumber: user.phoneNumber,
        address: user.address,
        status: user.status,
        role: user.role,
      })
      .from(user)
      .where(where)
      .orderBy(asc(user.createdAt), asc(user.id))
      .limit(limit)
      .offset(offset),
  ])

  return createPaginatedResponse(users, countRows[0]?.totalItems ?? 0, { page, pageSize })
})
