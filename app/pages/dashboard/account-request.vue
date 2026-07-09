<template>
  <UDashboardPanel
    id="account-request"
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
          root: 'flex gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between',
          left: 'min-w-0 py-3',
          right: 'lg:w-auto',
        }"
      >
        <template #left>
          <div>
            <h2 class="text-xl font-semibold sm:text-2xl">Account Requests</h2>
            <p class="text-toned">Review and manage pending account access requests</p>
          </div>
        </template>

        <template #right>
          <UDashboardSearchButton
            class="hidden justify-start md:flex md:w-full lg:w-[450px]"
            label="Search account requests by name, email, or status."
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="rounded-xl bg-white p-4 sm:p-5">
        <div
          class="mb-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:text-center"
        >
          <h3 class="text-xl font-semibold">Pending Accounts</h3>
          <UBadge
            color="primary"
            variant="soft"
            size="lg"
          >
            {{ users.length }} pending
          </UBadge>
        </div>

        <div class="max-w-full overflow-x-auto">
          <UserManagementTable
            :users="users"
            :pending="pending"
            :error="error"
            :approving-user-id="approvingUserId"
            @approve-user="handleApproveUser"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})

const toast = useToast()
const approvingUserId = ref<UserManagementUser['id'] | null>(null)
const { users, pending, error, approveUser } = useUsers({
  fetchUsers: true,
  filters: {
    approvalStatus: 'pending',
  },
})

const handleApproveUser: ApproveUserEventHandler = async (userId) => {
  approvingUserId.value = userId
  const result = await approveUser(userId)
  approvingUserId.value = null

  if (result.type === 'success') {
    toast.add({
      title: 'Account approved',
      description: result.data.updatedUser.name,
      color: 'primary',
      icon: 'i-lucide-check',
    })
    return
  }

  toast.add({
    title: 'Account approval failed',
    description: result.error,
    color: 'error',
    icon: 'i-lucide-triangle-alert',
  })
}
</script>

<style scoped></style>
