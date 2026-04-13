<template>
  <div
    v-if="pending"
    class="min-w-[860px] w-full overflow-x-auto rounded-xl border border-default"
  >
    <div class="bg-primary-50 grid grid-cols-[minmax(260px,2.4fr)_minmax(180px,1.5fr)_minmax(160px,1.2fr)_minmax(160px,1.2fr)_120px] border-b border-default">
      <div
        v-for="header in tableHeaders"
        :key="header"
        class="px-4 py-3 text-sm font-medium text-default"
      >
        {{ header }}
      </div>
    </div>

    <div
      v-for="row in skeletonRows"
      :key="row"
      class="grid grid-cols-[minmax(260px,2.4fr)_minmax(180px,1.5fr)_minmax(160px,1.2fr)_minmax(160px,1.2fr)_120px] items-center border-b border-default px-4 py-4 last:border-b-0"
    >
      <div class="flex items-center gap-3">
        <USkeleton class="h-10 w-8 rounded-sm" />
        <USkeleton class="h-4 w-40" />
      </div>
      <USkeleton class="h-4 w-28" />
      <USkeleton class="h-4 w-24" />
      <USkeleton class="h-4 w-28" />
      <div class="flex items-center gap-2">
        <USkeleton class="h-8 w-8 rounded-md" />
        <USkeleton class="h-8 w-8 rounded-md" />
      </div>
    </div>
  </div>

  <UTable
    v-else
    v-model:sorting="sorting"
    :data="books"
    :columns="columns"
    :sorting-options="sortingOptions"
    sticky
    :ui="{
      base: 'min-w-[860px] w-full overflow-x-auto rounded-xl border border-default',
      thead: 'bg-primary-50 border-0',
      th: 'sticky top-0 z-10 border-b border-default bg-primary-50 px-4 py-3 text-sm font-medium text-default',
      td: 'border-b border-default px-4 py-4 text-sm align-middle last:border-b-0',
    }"
  >
    <template #empty>
      <div
        v-if="error"
        class="p-6"
      >
        <UAlert
          color="error"
          icon="i-lucide-triangle-alert"
          title="Unable to load books"
          description="Something went wrong while fetching the book data. Please try again later."
        />
      </div>
      <div
        v-else
        class="text-toned px-6 py-12 text-center text-sm"
      >
        No books available yet.
      </div>
    </template>

    <template #name-header="{ column }">
      <UButton
        color="neutral"
        variant="ghost"
        :label="'Book Title'"
        :icon="getSortIcon(column.getIsSorted())"
        class="-mx-2"
        @click="column.getToggleSortingHandler()?.($event)"
      />
    </template>

    <template #author-header="{ column }">
      <UButton
        color="neutral"
        variant="ghost"
        :label="'Author'"
        :icon="getSortIcon(column.getIsSorted())"
        class="-mx-2"
        @click="column.getToggleSortingHandler()?.($event)"
      />
    </template>

    <template #category-header="{ column }">
      <UButton
        color="neutral"
        variant="ghost"
        :label="'Genre'"
        :icon="getSortIcon(column.getIsSorted())"
        class="-mx-2"
        @click="column.getToggleSortingHandler()?.($event)"
      />
    </template>

    <template #createdAt-header="{ column }">
      <UButton
        color="neutral"
        variant="ghost"
        :label="'Date Created'"
        :icon="getSortIcon(column.getIsSorted())"
        class="-mx-2"
        @click="column.getToggleSortingHandler()?.($event)"
      />
    </template>

    <template #name-cell="{ row }">
      <div class="flex items-center gap-3">
        <NuxtImg
          :src="row.original.imageUrl || '/book-cover.webp'"
          alt="Book cover"
          class="h-10 w-8 rounded-sm object-cover"
        />
        <p class="text-highlighted font-medium">{{ row.original.name }}</p>
      </div>
    </template>

    <template #createdAt-cell="{ row }">
      <NuxtTime
        :datetime="row.original.createdAt"
        year="numeric"
        month="short"
        day="2-digit"
        locale="en"
      />
    </template>

    <template #actions-cell>
      <div class="flex items-center gap-1">
        <UButton
          icon="jpkdz-admin-edit"
          color="primary"
          variant="ghost"
          size="md"
          aria-label="Edit book"
        />
        <UButton
          icon="jpkdz-admin-trash"
          color="error"
          variant="ghost"
          size="md"
          aria-label="Delete book"
        />
      </div>
    </template>
  </UTable>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { BookItem } from '~~/layers/book-catalog/app/composables/useBooks'

defineProps<{
  books: BookItem[]
  pending: boolean
  error: unknown
}>()

const sorting = ref([])
const tableHeaders = ['Book Title', 'Author', 'Genre', 'Date Created', 'Action']
const skeletonRows = 6

const sortingOptions = {
  isMultiSortEvent: (event: unknown) => {
    if (!(event instanceof MouseEvent) && !(event instanceof KeyboardEvent)) {
      return false
    }
    return event.shiftKey || event.ctrlKey
  },
}

const getSortIcon = (direction: false | 'asc' | 'desc') => {
  if (direction === 'asc') {
    return 'i-lucide-arrow-up-narrow-wide'
  }

  if (direction === 'desc') {
    return 'i-lucide-arrow-down-wide-narrow'
  }

  return 'i-lucide-arrow-up-down'
}

const columns: TableColumn<BookItem>[] = [
  {
    accessorKey: 'name',
    header: 'Book Title',
    sortingFn: 'textCaseSensitive',
  },
  {
    accessorKey: 'author',
    header: 'Author',
    sortingFn: 'textCaseSensitive',
  },
  {
    accessorKey: 'category',
    header: 'Genre',
    sortingFn: 'textCaseSensitive',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Created',
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    header: 'Action',
    enableSorting: false,
  },
]
</script>

<style scoped></style>
