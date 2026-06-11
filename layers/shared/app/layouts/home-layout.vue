<template>
  <div class="font-plex tracking-wider">
    <SharedHeader
      :current-path="currentPath"
      :username="user?.name"
      @logout="handleLogout"
    />

    <slot />

    <SharedFooter />
  </div>
</template>

<script setup lang="ts">
import type { LogoutEventHandler } from '~~/layers/auth/app/utils/types'
import { useUserStore } from '~~/layers/shared/app/stores/useUserStore'

const route = useRoute()
const currentPath = computed(() => route.path)

const toast = useToast()
const { logout } = useAuth()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const handleLogout: LogoutEventHandler = async () => {
  const result = await logout()

  if (result.type === 'failure') {
    toast.add({
      title: 'Logout failed',
      description: result.error,
      color: 'error',
    })

    return
  }

  userStore.user = null
  userStore.session = null
  await navigateTo('/')
}

await callOnce('auth', async () => {
  await userStore.getUser()
})
</script>

<style scoped>
:global(body) {
  background: radial-gradient(ellipse 80% 100% at 10% 10%, #0d1f35 0%, #07101e 45%, #030810 100%);
}
</style>
