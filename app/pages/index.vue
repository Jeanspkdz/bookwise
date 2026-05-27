<template>
  <UMain>
    <HeroSection
      :featured-book="featuredBook"
      :pending="pending"
    />
    <PopularBooksSection
      :books="popularBooks"
      :pending="pending"
    />
  </UMain>
</template>

<script setup lang="ts">
const { featuredBook, popularBooks, pending, error } = useHomeData()

watch(
  error,
  (value) => {
    if (!value) {
      return
    }

    console.error('Failed to load home data', value)
  },
  { immediate: true },
)

definePageMeta({
  layout: 'home-layout',
})
</script>

<style scoped></style>
