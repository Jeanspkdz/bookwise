import { useUserStore } from '~~/layers/shared/app/stores/useUserStore'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) {
    return
  }

  const userStore = useUserStore()
  const { getUser } = userStore
  const { user } = storeToRefs(userStore)
  await callOnce('auth', async () => {
    console.log('From middleware')
    await getUser()
  })

  // if (!userStore.user || userStore.user.role === 'user') {
  if (!user.value) {
    return navigateTo('/')
  }
})
