import type { Session } from 'better-auth'

export const useUserStore = defineStore('user-store', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const isPending = ref(false)
  const error = ref<unknown>(null)

  const getUser = async () => {
    isPending.value = true
    error.value = null

    try {
      const { data, error: sessionError } = await authClient.useSession(useFetch)

      if (sessionError.value) {
        error.value = sessionError.value
        return null
      }

      session.value = data.value?.session ?? null

      const currentUser = data.value?.user

      user.value = currentUser
        ? {
            ...currentUser,
            image: currentUser.image ?? null,
            isApproved: currentUser.isApproved ?? false,
            role: currentUser.role ?? 'user',
          }
        : null

      return user.value
    } finally {
      isPending.value = false
    }
  }

  return {
    user,
    session,
    isPending,
    error,
    getUser,
  }
})
