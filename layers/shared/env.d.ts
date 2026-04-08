declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NUXT_DATABASE_URL: string
    }
  }
}
export {}
