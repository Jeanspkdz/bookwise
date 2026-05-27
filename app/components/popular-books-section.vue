<template>
  <UContainer class="py-[180px]">
    <h2 class="text-secondary-200 text-2xl font-semibold">Popular Books</h2>

    <div class="mt-12 grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-9">
      <template v-if="!pending">
        <BookCatalogBookCard
          v-for="book in books"
          :key="book.id"
          :name="book.name"
          :category="book.category"
          :cover-url="book.imageUrl"
          :cover-color="book.coverColor"
          class="w-[170px]"
        />
      </template>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
defineProps<{
  books: Book[]
  pending?: boolean
}>()
</script>

<style scoped></style>
