<template>
  <UContainer>
    <div
      class="text-secondary-200 flex flex-col gap-12 py-12 lg:flex-row lg:items-center lg:gap-x-20 lg:py-20"
    >
      <SharedAsyncState
        :pending="pending"
        :error="error"
        @refresh="emit('refresh')"
      >
        <template #pending>
          <HeroSectionSkeleton />
        </template>
        <template #error="{ refresh }">
          <HeroSectionError @refresh="refresh" />
        </template>
        <BookCatalogBookOverview
          :book="featuredBook"
          :detail="detail"
        />
      </SharedAsyncState>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
defineProps<{
  featuredBook: Book | null
  pending?: boolean
  error?: string | null
  detail?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>
