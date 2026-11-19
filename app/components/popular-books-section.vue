<template>
  <HomeSection title="Popular Books">
    <div class="mt-12">
      <SharedAsyncState
        :pending="pending"
        :error="error"
        error-title="Unable to load popular books"
        @refresh="emit('refresh')"
      >
        <template #pending>
          <PopularBooksSectionSkeleton />
        </template>
        <BookCatalogBookGrid :books="books" />
      </SharedAsyncState>
    </div>
  </HomeSection>
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
