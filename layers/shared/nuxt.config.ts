import { join, resolve } from 'node:path'
export default defineNuxtConfig({
  css: [join(import.meta.dirname, 'app', 'assets', 'main.css')],
  modules: ['@nuxt/ui'],
  components: [
    {
      path: join(import.meta.dirname, 'app', 'components'),
      prefix: 'Shared',
    },
  ],
  runtimeConfig: {
    databaseUrl: 'DEFAULT_VALUE',
  },
  icon: {
    mode: 'svg',
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
    customCollections: [
      {
        prefix: 'jpkdz',
        dir: join(import.meta.dirname, 'app', 'assets', 'icons'),
        recursive: true,
      },
    ],
  },
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin-ext', 'latin'],
    },
  },
  typescript: {
    nodeTsConfig: {
      include: [
        resolve(import.meta.dirname, 'drizzle.config.ts'), // node types
        resolve(import.meta.dirname, '*.d.ts'),
      ],
    },
  },
  nitro: {
    typescript: {
      tsConfig: {
        include: [resolve(import.meta.dirname, '*.d.ts')],
      },
    },
  },
})
