// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@pinia/nuxt'],
  image: {
    domains: ['jvxbumdjlq.ufs.sh'],
  },
  routeRules: {
    '/dashboard/**': {
      appLayout: 'dashboard-layout',
      cache: {
        maxAge: 60,
        staleMaxAge: 60 * 2,
      },
    },
  },
})
