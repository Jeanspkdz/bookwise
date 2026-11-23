<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-9">
    <NuxtLink
      v-for="book in books"
      :key="book.id"
      :to="`/book/${book.id}`"
      class="focus-visible:outline-primary w-[170px] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-8"
    >
      <BookCatalogBookCard
        :name="showAuthor ? `${book.name} - By ${book.author}` : book.name"
        :category="book.category"
        :cover-url="book.imageUrl"
        :cover-color="book.coverColor"
        class="w-[170px]"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ books: Book[]; showAuthor?: boolean }>()
</script>
