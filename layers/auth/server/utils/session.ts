import type { H3Event } from 'h3'

import { auth } from './auth'

export const getServerSession = async (event: H3Event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return session
}
