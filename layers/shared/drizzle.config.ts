import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'drizzle-kit'

const { NUXT_DATABASE_URL } = process.env
if (!NUXT_DATABASE_URL) {
  throw Error('DatabaseUrl not found')
}

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  out: join(currentDir, 'server', 'db', 'migrations'),
  schema: posix.join('layers', 'shared', 'server', 'db', 'schema', '*.ts'), //glob pattern
  dialect: 'postgresql',
  dbCredentials: {
    url: NUXT_DATABASE_URL,
  },
})
