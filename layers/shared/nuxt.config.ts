import { join } from 'node:path'

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
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
    // provider: 'server',
    customCollections: [
      {
        prefix: 'jpkdz',
        dir: join(import.meta.dirname, 'app', 'assets', 'icons'),
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
})
