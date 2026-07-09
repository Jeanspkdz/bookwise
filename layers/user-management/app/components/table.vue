<template>
  <UserManagementTableSkeleton v-if="props.pending" />

  <div
    v-else
    class="space-y-4"
  >
    <UTable
      ref="usersTable"
      v-model:sorting="sorting"
      v-model:pagination="pagination"
      :data="props.users"
      :columns="columns"
      :sorting-options="sortingOptions"
      :pagination-options="paginationOptions"
      sticky
      :ui="{
        base: 'min-w-[760px] w-full overflow-x-auto rounded-xl border border-default',
        thead: 'bg-primary-50 border-0',
        tr: 'hover:bg-primary-50/70 transition-colors',
        th: 'sticky top-0 z-10 border-b border-default bg-primary-50 px-4 py-3 text-sm font-medium text-default',
        td: 'border-b border-default px-4 py-4 text-sm align-middle last:border-b-0',
      }"
    >
      <template #empty>
        <div
          v-if="props.error"
          class="p-6"
        >
          <UAlert
            color="error"
            icon="i-lucide-triangle-alert"
            title="Unable to load account requests"
            description="Something went wrong while fetching pending account requests. Please try again later."
          />
        </div>
        <div
          v-else
          class="text-toned px-6 py-12 text-center text-sm"
        >
          No pending account requests.
        </div>
      </template>

      <template #name-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Name"
          :icon="getSortIcon(column.getIsSorted())"
          class="-mx-2"
          @click="column.getToggleSortingHandler()?.($event)"
        />
      </template>

      <template #dateJoined-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Date Joined"
          :icon="getSortIcon(column.getIsSorted())"
          class="-mx-2"
          @click="column.getToggleSortingHandler()?.($event)"
        />
      </template>

      <template #universityId-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="University ID"
          :icon="getSortIcon(column.getIsSorted())"
          class="-mx-2"
          @click="column.getToggleSortingHandler()?.($event)"
        />
      </template>

      <template #name-cell="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar
            :alt="row.original.name"
            :src="undefined"
            size="lg"
          />
          <div class="min-w-0">
            <p class="text-highlighted truncate font-medium">{{ row.original.name }}</p>
            <p class="text-toned truncate text-xs">{{ row.original.email }}</p>
          </div>
        </div>
      </template>

      <template #dateJoined-cell="{ row }">
        <NuxtTime
          :datetime="row.original.dateJoined"
          year="numeric"
          month="short"
          day="2-digit"
          locale="en"
        />
      </template>

      <template #actions-cell="{ row }">
        <UserManagementApproveAccountRequestModal
          :user="row.original"
          :loading="props.approvingUserId === row.original.id"
          @approve-user="approveUser"
        />
      </template>
    </UTable>

    <div
      v-if="props.users.length"
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-toned text-sm">
        Showing {{ (tableRef?.tableApi.getState().pagination.pageIndex || 0) + 1 }}-{{
          tableRef?.tableApi.getPageCount()
        }}
        of {{ props.users.length }} account requests
      </p>

      <UPagination
        :page="pagination.pageIndex + 1"
        :items-per-page="pagination.pageSize"
        :total="props.users.length"
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

const props = defineProps<{
  users: UserManagementUser[]
  pending: boolean
  error: unknown
  approvingUserId: UserManagementUser['id'] | null
}>()

const emit = defineEmits<{
  approveUser: Parameters<ApproveUserEventHandler>
}>()

const tableRef = useTemplateRef('usersTable')

const columns: TableColumn<UserManagementUser>[] = [
  { accessorKey: 'name', header: 'Name', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'dateJoined', header: 'Date Joined', sortingFn: 'datetime' },
  { accessorKey: 'universityId', header: 'University ID', sortingFn: 'textCaseSensitive' },
  { id: 'actions', header: 'Actions', enableSorting: false },
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

const approveUser = (userId: UserManagementUser['id']) => {
  emit('approveUser', userId)
}
</script>
