// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  extends: [
    './layers/shared',
    './layers/profile',
    './layers/book-catalog',
    './layers/auth',
    './layers/user-management',
  ],
  modules: ['@nuxt/eslint', '@nuxt/image', '@pinia/nuxt'],
  image: {
    // domains: ['jvxbumdjlq.ufs.sh'],
  },
  routeRules: {
    '/dashboard/**': {
      appLayout: 'dashboard-layout',
    },
  },
})
