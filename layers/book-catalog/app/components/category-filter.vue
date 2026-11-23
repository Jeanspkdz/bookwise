<template>
  <SharedAsyncState
    :pending="pending"
    :error="error"
    error-title="Unable to load categories"
    @refresh="refresh"
  >
    <template #pending>
      <USkeleton class="h-10 w-64 rounded" />
    </template>
    <template #error="{ refresh: retry }">
      <UButton
        variant="soft"
        color="neutral"
        icon="i-lucide-refresh-cw"
        label="Retry loading categories"
        @click="retry"
      />
    </template>
    <div class="bg-secondary-800 flex items-center gap-2 rounded px-4 py-1">
      <label
        for="book-category"
        class="text-secondary-200 text-sm"
        >Category:</label
      >
      <USelectMenu
        id="book-category"
        v-model="selection"
        :items="items"
        value-key="value"
        :search-input="{ placeholder: 'Find a category' }"
        variant="none"
        class="w-48"
        :ui="{ base: 'text-primary font-semibold' }"
      />
    </div>
  </SharedAsyncState>
</template>

<script setup lang="ts">
const category = defineModel<string | undefined>()
const { categories, pending, error, refresh } = useBookCategories()
const items = computed(() => {
  const values = [...categories.value]
  if (category.value && !values.includes(category.value)) values.unshift(category.value)
  return [
    { label: 'All categories', value: 'all' },
    ...values.map((value) => ({ label: value, value: `category:${value}` })),
  ]
})
const selection = computed({
  get: () => (category.value ? `category:${category.value}` : 'all'),
  set: (value: string) => {
    category.value = value === 'all' ? undefined : value.slice('category:'.length)
  },
})
</script>
