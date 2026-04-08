/// <reference types="node" />
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'drizzle-kit'
const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  out: join(currentDir, 'server', 'db', 'migrations'),
  schema: posix.join('./', 'layers', 'shared', 'server', 'db', 'schema', '*.ts'),
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NUXT_DATABASE_URL!,
  },
})
