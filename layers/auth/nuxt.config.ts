import { join } from 'node:path'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  components: [
    {
      path: join(import.meta.dirname, 'app', 'components'),
      prefix: 'Auth',
    },
  ],
})
