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

  const approveUser = async (
    id: ApproveUserPayload,
  ): Promise<Result<ApproveUserResponse, string>> => {
    try {
      const response = await $fetch<ApproveUserResponse>(`/api/users/${id}`, {
        method: 'PATCH',
        body: {
          isApproved: true,
        },
      })

      data.value = (data.value ?? []).filter((user) => user.id !== response.updatedUser.id)

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to approve user',
      }
    }
  }

  return {
    users: computed(() => data.value ?? []),
    pending,
    error,
    refresh,
    approveUser,
  }
}
