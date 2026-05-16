<template>
  <div class="font-plex">
    <SharedHeader :current-path="currentPath" />

    <UMain>
      <slot />
    </UMain>

    <SharedFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const currentPath = computed(() => route.path)
</script>

<style scoped>
:global(body) {
  background: radial-gradient(ellipse 80% 100% at 10% 10%, #0d1f35 0%, #07101e 45%, #030810 100%);
}
</style>
