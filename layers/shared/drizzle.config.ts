import { posix } from 'node:path'

import { defineConfig } from 'drizzle-kit'

const { NUXT_DATABASE_URL } = process.env
if (!NUXT_DATABASE_URL) {
  throw Error('DatabaseUrl not found')
}

export default defineConfig({
  out: posix.join('layers', 'shared', 'server', 'db', 'migrations'),
  schema: posix.join('layers', 'shared', 'server', 'db', 'schema', '*.ts'), //glob pattern
  dialect: 'postgresql',
  dbCredentials: {
    url: NUXT_DATABASE_URL,
  },
})
