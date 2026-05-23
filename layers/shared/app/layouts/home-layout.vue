<template>
  <div class="font-plex tracking-wider">
    <SharedHeader
      :current-path="currentPath"
      :username="user?.name"
    />

    <UMain>
      <slot />
    </UMain>

    <SharedFooter />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~~/layers/shared/app/stores/useUserStore'

const route = useRoute()
const currentPath = computed(() => route.path)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
await callOnce('auth', async () => {
  await userStore.getUser()
})
</script>

<style scoped>
:global(body) {
  background: radial-gradient(ellipse 80% 100% at 10% 10%, #0d1f35 0%, #07101e 45%, #030810 100%);
}
</style>
