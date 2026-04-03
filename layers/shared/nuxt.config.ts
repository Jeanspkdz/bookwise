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
})
