import { useUserStore } from '~~/layers/shared/app/stores/useUserStore'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) {
    return
  }

  const userStore = useUserStore()
  const { getUser } = userStore
  const { user } = storeToRefs(userStore)
  await callOnce('auth', async () => {
    await getUser()
    console.log('From middleware')
  })

  // if (!userStore.user || userStore.user.role === 'user') {
  if (!user) {
    return navigateTo('/')
  }
})
