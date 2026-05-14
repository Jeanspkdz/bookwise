import { authClient } from '~~/layers/auth/app/utils/auth'

export const useAuthStore = defineStore('auth-store', () => {
  async function getAuth() {
    const { data, isPending, error } = await authClient.useSession(useFetch)

    return {
      isPending,
      error,
      session: data.value?.session,
      user: data.value?.user,
    }
  }

  return {
    getAuth,
  }
})
