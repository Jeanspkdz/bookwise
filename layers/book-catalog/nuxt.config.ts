import { join } from 'node:path'

export default defineNuxtConfig({
  components: [
    {
      path: join(import.meta.dirname, 'app', 'components'),
      prefix: 'BookCatalog',
    },
  ],
  modules: ['nuxt-uploadthing'],
  uploadthing: {
    fileRouterPath: '~~/layers/book-catalog/server/utils/uploadthing',
    fileRouterExport: 'uploadRouter',
    useTailwindStyles: true,
  },
})
