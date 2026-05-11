import { join } from 'node:path'

export default defineNuxtConfig({
  components: [
    {
      path: join(import.meta.dirname, 'app', 'components'),
      prefix: 'Auth',
    },
  ],
})
