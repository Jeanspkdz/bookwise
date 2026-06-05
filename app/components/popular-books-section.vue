<template>
  <UContainer class="py-[180px]">
    <h2 class="text-secondary-200 text-2xl font-semibold">Popular Books</h2>

    <PopularBooksSectionSkeleton
      v-if="pending"
      class="mt-12"
    />

    <UEmpty
      v-else-if="error"
      class="mt-12"
      icon="i-lucide-triangle-alert"
      title="Unable to load popular books"
      :description="error"
      :actions="[
        {
          label: 'Try again',
          icon: 'i-tabler-refresh',
          onClick: () => emit('refresh'),
        },
      ]"
    />

    <div
      v-else
      class="mt-12 grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-9"
    >
      <BookCatalogBookCard
        v-for="book in books"
        :key="book.id"
        :name="book.name"
        :category="book.category"
        :cover-url="book.imageUrl"
        :cover-color="book.coverColor"
        class="w-[170px]"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
defineProps<{
  books: Book[]
  pending?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<style scoped></style>
