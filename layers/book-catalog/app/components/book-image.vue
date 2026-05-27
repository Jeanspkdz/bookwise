<template>
  <div class="relative">
    <BookCatalogBookCover
      :color="coverColor"
      class="h-full w-full"
    />
    <NuxtImg
      alt="Book cover image"
      sizes="200px md:240px lg:277px"
      :src="imageUrl"
      class="absolute top-0 right-0 h-[88%] w-[88%]"
    />
  </div>
</template>

<script setup lang="ts">
const { imageUrl = '/book-cover.webp', coverColor = '#1d2a4a' } = defineProps<{
  imageUrl?: string
  coverColor?: string
}>()
</script>

<style scoped></style>
