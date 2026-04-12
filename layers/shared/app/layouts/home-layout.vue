<template>
  <div>
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
body {
  background-color: #111624;
  background-image:
    radial-gradient(ellipse at 40% 15%, #1a2a5e 0%, transparent 60%),
    radial-gradient(ellipse at 70% 60%, #0d1a42 0%, transparent 50%);
  min-height: 100vh;
}
</style>
