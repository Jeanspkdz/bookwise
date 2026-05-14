export default defineNuxtRouteMiddleware(async (_to) => {
  const { getAuth } = useAuthStore()
  const auth = await getAuth()
  console.log('AUTH_MIDDLEWARE', auth)
})
