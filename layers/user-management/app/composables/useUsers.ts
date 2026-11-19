import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { Result } from '~~/layers/shared/shared/types/result'

type UseUsersOptions = {
  fetchUsers?: boolean
  filters?: MaybeRefOrGetter<GetUsersFilters>
}

export function useUsers(options: UseUsersOptions = {}) {
  const { fetchUsers = false } = options
  const filters = computed(() => toValue(options.filters) ?? {})
  const searchParams = computed(() => {
    const params = new URLSearchParams()

    Object.entries(filters.value).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    params.sort()

    return params.toString()
  })

  const { data, pending, error, refresh } = useFetch<UserManagementUser[]>('/api/users', {
    method: 'GET',
    key: computed(() => `admin-users-${searchParams.value}`),
    lazy: true,
    immediate: fetchUsers,
    default: () => [],
    query: filters,
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
