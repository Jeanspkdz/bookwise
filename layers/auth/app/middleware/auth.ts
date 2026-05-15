export default defineNuxtRouteMiddleware(async (_to) => {
  const { getAuth } = useAuth()
  const auth = await getAuth()
  console.log('AUTH_MIDDLEWARE', auth)
})
