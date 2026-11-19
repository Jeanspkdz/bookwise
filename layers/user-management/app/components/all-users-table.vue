<template>
  <UserManagementAllUsersTableSkeleton v-if="props.pending" />

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
        base: 'min-w-[1120px] w-full table-fixed rounded-xl border border-default',
        thead: 'bg-primary-50 border-0',
        tr: 'transition-colors hover:bg-primary-50/70',
        th: 'sticky top-0 z-10 border-b border-default bg-primary-50 px-4 py-3 text-sm font-medium text-default',
        td: 'border-b border-default px-4 py-3.5 text-sm align-middle last:border-b-0',
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
            title="Unable to load users"
            description="Something went wrong while fetching users. Please try again later."
          />
        </div>
        <div
          v-else
          class="flex flex-col items-center gap-2 px-6 py-12 text-center"
        >
          <UIcon
            name="i-lucide-users-round"
            class="text-muted size-7"
          />
          <p class="text-highlighted text-sm font-medium">No users found</p>
          <p class="text-toned text-sm">Try a different name, email, or student code.</p>
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

      <template #role-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Role"
          :icon="getSortIcon(column.getIsSorted())"
          class="-mx-2"
          @click="column.getToggleSortingHandler()?.($event)"
        />
      </template>

      <template #phoneNumber-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Phone Number"
          :icon="getSortIcon(column.getIsSorted())"
          class="-mx-2"
          @click="column.getToggleSortingHandler()?.($event)"
        />
      </template>

      <template #universityId-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Student Code"
          :icon="getSortIcon(column.getIsSorted())"
          class="-mx-2"
          @click="column.getToggleSortingHandler()?.($event)"
        />
      </template>

      <template #address-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Address"
          :icon="getSortIcon(column.getIsSorted())"
          class="-mx-2"
          @click="column.getToggleSortingHandler()?.($event)"
        />
      </template>

      <template #status-header="{ column }">
        <UButton
          color="neutral"
          variant="ghost"
          label="Account Status"
          :icon="getSortIcon(column.getIsSorted())"
          class="-mx-2"
          @click="column.getToggleSortingHandler()?.($event)"
        />
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

      <template #role-cell="{ row }">
        <UBadge
          color="neutral"
          variant="soft"
          :style="roleBadgeStyle[row.original.role]"
          class="capitalize"
        >
          {{ row.original.role }}
        </UBadge>
      </template>

      <template #phoneNumber-cell="{ row }">
        <span class="whitespace-nowrap tabular-nums">{{ row.original.phoneNumber || '—' }}</span>
      </template>

      <template #universityId-cell="{ row }">
        <span class="font-medium whitespace-nowrap tabular-nums">
          {{ row.original.universityId }}
        </span>
      </template>

      <template #address-cell="{ row }">
        <span
          class="block truncate"
          :title="row.original.address ?? undefined"
        >
          {{ row.original.address || '—' }}
        </span>
      </template>

      <template #status-cell="{ row }">
        <UBadge
          color="neutral"
          variant="soft"
          :style="statusBadgeStyle[row.original.status]"
          class="capitalize"
        >
          {{ row.original.status }}
        </UBadge>
      </template>
    </UTable>

    <div
      v-if="props.users.length"
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-toned text-sm">
        Showing {{ rangeStart }}–{{ rangeEnd }} of {{ props.users.length }} users
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
}>()

const tableRef = useTemplateRef('usersTable')

const columns: TableColumn<UserManagementUser>[] = [
  { accessorKey: 'name', header: 'Name', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'dateJoined', header: 'Date Joined', sortingFn: 'datetime' },
  { accessorKey: 'role', header: 'Role', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'phoneNumber', header: 'Phone Number', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'universityId', header: 'Student Code', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'address', header: 'Address', sortingFn: 'textCaseSensitive' },
  { accessorKey: 'status', header: 'Account Status', sortingFn: 'textCaseSensitive' },
]

const roleBadgeStyle: Record<UserRole, { backgroundColor: string; color: string }> = {
  admin: { backgroundColor: '#e9d5ff', color: '#6b21a8' },
  student: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
}

const statusBadgeStyle: Record<UserStatus, { backgroundColor: string; color: string }> = {
  pending: { backgroundColor: '#bfdbfe', color: '#1e40af' },
  approved: { backgroundColor: '#a7f3d0', color: '#065f46' },
  rejected: { backgroundColor: '#fecdd3', color: '#9f1239' },
}

const sorting = ref<SortingState>([{ id: 'dateJoined', desc: true }])
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

watch(
  () => props.users,
  () => {
    pagination.value.pageIndex = 0
  },
)

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

const rangeStart = computed(() =>
  props.users.length ? pagination.value.pageIndex * pagination.value.pageSize + 1 : 0,
)
const rangeEnd = computed(() =>
  Math.min((pagination.value.pageIndex + 1) * pagination.value.pageSize, props.users.length),
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
</script>
