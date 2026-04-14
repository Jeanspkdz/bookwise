<template>
  <BookCatalogTableSkeleton v-if="pending" />

  <div
    v-else
    class="space-y-4"
  >
    <UTable
      ref="booksTable"
      v-model:sorting="sorting"
      v-model:pagination="pagination"
      :data="books"
      :columns="columns"
      :sorting-options="sortingOptions"
      :pagination-options="paginationOptions"
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

    <div
      v-if="books.length"
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-toned text-sm">
        Showing {{ (tableRef?.tableApi.getState().pagination.pageIndex || 0) + 1 }}-{{
          tableRef?.tableApi.getPageCount()
        }}
        of {{ books.length }} books
      </p>

      <UPagination
        :page="pagination.pageIndex + 1"
        :items-per-page="pagination.pageSize"
        :total="books.length"
        show-edges
        :sibling-count="1"
        @update:page="tableRef?.tableApi?.setPageIndex($event - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { PaginationState, SortingState } from '@tanstack/vue-table'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { BookItem } from '~~/layers/book-catalog/app/composables/useBooks'

const { books } = defineProps<{
  books: BookItem[]
  pending: boolean
  error: unknown
}>()

const tableRef = useTemplateRef('booksTable')

const columns: TableColumn<BookItem>[] = [
  { accessorKey: 'name', header: 'Book Title', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'author', header: 'Author', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'category', header: 'Genre', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'createdAt', header: 'Date Created', sortingFn: 'datetime' },
  { id: 'actions', header: 'Action', enableSorting: false },
]

const sorting = ref<SortingState>([])
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const sortingOptions = {
  isMultiSortEvent: (event: unknown) => {
    if (!(event instanceof MouseEvent) && !(event instanceof KeyboardEvent)) {
      return false
    }
    return event.shiftKey || event.ctrlKey
  },
}

const paginationOptions = {
  getPaginationRowModel: getPaginationRowModel(),
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
</script>

<style scoped></style>
