<template>
  <UDashboardPanel
    id="all-users"
    :ui="{
      body: 'bg-primary-50 overflow-visible',
      root: 'overflow-y-auto',
    }"
  >
    <template #header>
      <UDashboardNavbar
        toggle-side="right"
        class="bg-primary-50 border-0"
        :ui="{
          root: 'flex gap-4 px-4 sm:px-6 lg:items-center lg:justify-between',
          left: 'min-w-0 flex-1 py-3',
          right: 'w-auto',
        }"
      >
        <template #left>
          <div class="min-w-0">
            <h2
              class="max-w-[calc(100vw-8rem)] truncate text-lg font-semibold sm:max-w-none sm:text-2xl"
            >
              Welcome, {{ userStore.user?.name ?? 'Admin' }}
            </h2>
            <p class="text-toned text-sm sm:text-base">Manage your registered users here</p>
          </div>
        </template>
        <template #right>
          <UInput
            v-model="search"
            aria-label="Search users"
            placeholder="Search by name, email, or student code"
            icon="i-lucide-search"
            class="hidden w-[320px] md:flex"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="rounded-xl bg-white p-4 sm:p-5">
        <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 class="text-lg font-semibold sm:text-xl">All Users</h3>
          <UInput
            v-model="search"
            aria-label="Search users"
            placeholder="Search by name, email, or student code"
            icon="i-lucide-search"
            class="w-full sm:w-[320px] md:hidden"
          />
        </div>

        <div class="max-w-full overflow-x-auto">
          <UserManagementAllUsersTable
            :users="users"
            :pending="pending"
            :error="error"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { useUserStore } from '~~/layers/shared/app/stores/useUserStore'

definePageMeta({
  colorMode: 'light',
})

const search = ref('')
const debouncedSearch = ref('')
const userStore = useUserStore()

watch(search, (value, _, onCleanup) => {
  const timeout = setTimeout(() => {
    debouncedSearch.value = value.trim()
  }, 250)

  onCleanup(() => clearTimeout(timeout))
})

const filters = computed<GetUsersFilters>(() => ({
  status: 'all',
  search: debouncedSearch.value || undefined,
}))

const { users, pending, error } = useUsers({
  fetchUsers: true,
  filters,
})
</script>
