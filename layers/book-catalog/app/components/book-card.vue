<template>
  <article>
    <BookCatalogBookImage
      :image-url="coverUrl"
      :cover-color="coverColor"
    />

    <div class="mt-4">
      <h4 class="text-xl font-semibold text-white">{{ name }}</h4>
      <span class="text-secondary-200 capitalize italic"> {{ category }} </span>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  category: string
  coverUrl: string
  coverColor: string
}>()
</script>

<style scoped>
.a {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
</style>
