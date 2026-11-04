import type { Result } from '~~/layers/shared/shared/types/result'

type UseUsersOptions = {
  fetchUsers?: boolean
  filters?: GetUsersFilters
}

export function useUsers(options: UseUsersOptions = {}) {
  const { fetchUsers = false, filters = {} } = options
  const searchParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  searchParams.sort()

  const { data, pending, error, refresh } = useFetch<UserManagementUser[]>('/api/users', {
    method: 'GET',
    key: `admin-users-${searchParams.toString()}`,
    lazy: true,
    immediate: fetchUsers,
    default: () => [],
    query: filters,
    headers: {
      'bookwise-dashboard-request': 'true',
    },
  })

  const updateStatus = async (
    id: ApproveUserPayload,
    action: 'approve' | 'reject',
  ): Promise<Result<ApproveUserResponse, string>> => {
    try {
      const response = await $fetch<ApproveUserResponse>(`/api/users/${id}/${action}`, {
        method: 'POST',
      })

      data.value = (data.value ?? []).filter((user) => user.id !== response.updatedUser.id)

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: `Something went wrong. Failed to ${action} user`,
      }
    }
  }

  const approveUser = (id: ApproveUserPayload) => updateStatus(id, 'approve')
  const rejectUser = (id: ApproveUserPayload) => updateStatus(id, 'reject')

  return {
    users: computed(() => data.value ?? []),
    pending,
    error,
    refresh,
    approveUser,
    rejectUser,
  }
}
