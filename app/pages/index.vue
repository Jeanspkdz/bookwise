<template>
  <UMain>
    <HeroSection
      :featured-book="featuredBook"
      :pending="featuredPending"
      :error="featuredError"
      @refresh="refreshFeaturedBook"
    />
    <PopularBooksSection
      :books="popularBooks"
      :pending="popularPending"
      :error="popularError"
      @refresh="refreshPopularBooks"
    />
  </UMain>
</template>

<script setup lang="ts">
const {
  featuredBook,
  featuredError,
  featuredPending,
  refreshFeaturedBook,
  popularBooks,
  popularError,
  popularPending,
  refreshPopularBooks,
} = useHomeData()

definePageMeta({
  layout: 'home-layout',
})
</script>

<style scoped></style>
