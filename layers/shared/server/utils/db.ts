import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { relations } from '#layers/shared/server/db/schema/_relations'

const { NUXT_DATABASE_URL } = process.env
if (!NUXT_DATABASE_URL) {
  throw Error('DatabaseUrl not found')
}

const client = postgres(NUXT_DATABASE_URL, { prepare: false })
export const db = drizzle({
  client,
  relations,
})
