import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import * as authSchema from '#layers/shared/server/db/schema/auth.schema'
import { db } from '#layers/shared/server/utils/db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      studentCode: {
        type: 'string',
        required: true,
      },
      phoneNumber: {
        type: 'string',
        required: true,
      },
      address: {
        type: 'string',
        required: true,
      },
      isApproved: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      role: {
        type: ['admin', 'user'],
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
})
