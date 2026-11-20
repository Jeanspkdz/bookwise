<template>
  <UserManagementTableSkeleton
    v-if="props.pending"
    :sorting="sorting"
  />

  <div
    v-else
    class="space-y-4"
  >
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-highlighted text-lg font-semibold sm:text-xl">
        Account Registration Requests
      </h3>
    </div>

    <div class="max-w-full overflow-x-auto">
      <UTable
        v-model:sorting="sorting"
        :data="props.users"
        :columns="columns"
        :sorting-options="sortingOptions"
        sticky
        :ui="{
          base: 'min-w-[760px] w-full',
          thead: 'border-0',
          tr: 'transition-colors hover:bg-primary-50/70',
          th: 'sticky top-0 z-10 border-0 bg-primary-50 px-4 py-3 text-xs font-medium text-muted first:rounded-tl-md last:rounded-tr-md sm:text-sm',
          td: 'border-b border-default px-4 py-3.5 align-middle text-sm last:border-b-0',
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
            class="flex flex-col items-center gap-2 px-6 py-12 text-center"
          >
            <UIcon
              name="i-lucide-user-round-check"
              class="text-muted size-7"
            />
            <p class="text-highlighted text-sm font-medium">No pending account requests</p>
            <p class="text-toned text-sm">New student registrations will appear here.</p>
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
            label="University ID No"
            :icon="getSortIcon(column.getIsSorted())"
            class="-mx-2"
            @click="column.getToggleSortingHandler()?.($event)"
          />
        </template>

        <template #actions-header>
          <span class="-mx-2 inline-flex items-center px-2 py-1.5">Actions</span>
        </template>

        <template #name-cell="{ row }">
          <div class="flex min-w-0 items-center gap-3">
            <UAvatar
              :alt="row.original.name"
              :src="row.original.image ?? undefined"
              size="md"
              class="shrink-0"
            />
            <div class="min-w-0">
              <p class="text-highlighted truncate font-semibold">{{ row.original.name }}</p>
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
            class="font-medium whitespace-nowrap tabular-nums"
          />
        </template>

        <template #universityId-cell="{ row }">
          <span class="font-medium whitespace-nowrap tabular-nums">
            {{ row.original.universityId }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">
            <UserManagementApproveAccountRequestModal
              :user="row.original"
              :loading="props.approvingUserId === row.original.id"
              @approve-user="approveUser"
            />
            <UserManagementRejectAccountRequestModal
              :user="row.original"
              :loading="props.rejectingUserId === row.original.id"
              @reject-user="rejectUser"
            />
          </div>
        </template>
      </UTable>
    </div>

    <div
      v-if="props.users.length"
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-toned text-sm">
        Showing {{ rangeStart }}–{{ rangeEnd }} of {{ props.pagination.totalItems }} account
        requests
      </p>

      <UPagination
        :page="props.pagination.page"
        :items-per-page="props.pagination.pageSize"
        :total="props.pagination.totalItems"
        show-edges
        :sibling-count="1"
        @update:page="emit('updatePage', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { SortingState } from '@tanstack/vue-table'
import type { PaginationMetadata } from '~~/layers/shared/shared/types/pagination'

const props = defineProps<{
  users: UserManagementUser[]
  pagination: PaginationMetadata
  pending: boolean
  error: unknown
  approvingUserId: UserManagementUser['id'] | null
  rejectingUserId: UserManagementUser['id'] | null
}>()

const emit = defineEmits<{
  approveUser: Parameters<ApproveUserEventHandler>
  rejectUser: Parameters<RejectUserEventHandler>
  updatePage: [page: number]
}>()

const columns: TableColumn<UserManagementUser>[] = [
  { accessorKey: 'name', header: 'Name', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'dateJoined', header: 'Date Joined', sortingFn: 'datetime' },
  { accessorKey: 'universityId', header: 'University ID No', sortingFn: 'textCaseSensitive' },
  { id: 'actions', header: 'Actions', enableSorting: false },
]

const sorting = ref<SortingState>([{ id: 'dateJoined', desc: false }])
const sortingOptions = {
  isMultiSortEvent: (event: unknown) => {
    if (!(event instanceof MouseEvent) && !(event instanceof KeyboardEvent)) {
      return false
    }
    return event.shiftKey || event.ctrlKey
  },
}

const rangeStart = computed(() =>
  props.pagination.totalItems ? (props.pagination.page - 1) * props.pagination.pageSize + 1 : 0,
)
const rangeEnd = computed(() =>
  Math.min(props.pagination.page * props.pagination.pageSize, props.pagination.totalItems),
)

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

const rejectUser = (userId: UserManagementUser['id']) => {
  emit('rejectUser', userId)
}
</script>
