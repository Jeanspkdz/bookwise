<template>
  <UContainer class="py-[180px]">
    <h2 class="text-secondary-200 text-2xl font-semibold">{{ title }}</h2>
    <slot />
  </UContainer>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
