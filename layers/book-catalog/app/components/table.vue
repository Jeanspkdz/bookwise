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
        tr: 'cursor-pointer hover:bg-primary-50/70 transition-colors',
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
            :src="row.original.imageUrl"
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

      <template #actions-cell="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            icon="jpkdz-admin-edit"
            color="primary"
            variant="ghost"
            size="md"
            aria-label="Edit book"
            :to="`/dashboard/book/${row.original.id}/update`"
            @click.stop
          />
          <UModal title="Delete book">
            <UButton
              icon="jpkdz-admin-trash"
              color="error"
              variant="ghost"
              size="md"
              aria-label="Delete book"
              @click.stop
            />

            <template #description>
              <p class="text-toned text-sm">
                Are you sure you want to permanently delete
                <span class="text-highlighted font-medium">{{ row.original.name }}</span
                >?
              </p>
            </template>

            <template #footer="{ close }">
              <div class="flex w-full justify-end">
                <UButton
                  color="error"
                  variant="solid"
                  label="Delete"
                  @click="
                    () => {
                      confirmDeleteBook(row.original.id)
                      close()
                    }
                  "
                />
              </div>
            </template>
          </UModal>
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

const { books } = defineProps<{
  books: Book[]
  pending: boolean
  error: unknown
}>()

const emit = defineEmits<{
  deleteBook: Parameters<DeleteBookEventHandler>
  selectBook: Parameters<SelectBookEventHandler>
}>()

const tableRef = useTemplateRef('booksTable')

const columns: TableColumn<Book>[] = [
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

const confirmDeleteBook = (bookId: string) => {
  emit('deleteBook', bookId)
}
</script>

<style scoped></style>
