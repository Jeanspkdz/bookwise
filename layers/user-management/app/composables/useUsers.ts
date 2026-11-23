import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~~/layers/shared/shared/types/pagination'
import type { Result } from '~~/layers/shared/shared/types/result'
import { DEFAULT_PAGE_SIZE } from '~~/layers/shared/shared/utils/constants'
import { createEmptyPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

type UseUsersOptions = {
  fetchUsers?: boolean
  filters?: MaybeRefOrGetter<GetUsersFilters>
}

export function useUsers(options: UseUsersOptions = {}) {
  const { fetchUsers = false } = options
  const filters = computed(() => toValue(options.filters) ?? {})
  const { page, setPage, watchTotalPages } = usePagination([() => JSON.stringify(filters.value)])
  const query = computed(() => ({
    ...filters.value,
    page: page.value,
    pageSize: DEFAULT_PAGE_SIZE,
  }))
  const queryKey = computed(() => `admin-users-${JSON.stringify(query.value)}`)

  const { data, pending, error, refresh } = useFetch<PaginatedResponse<UserManagementUser>>(
    '/api/users',
    {
      method: 'GET',
      key: queryKey,
      lazy: true,
      immediate: fetchUsers,
      default: () =>
        createEmptyPaginatedResponse<UserManagementUser>(page.value, DEFAULT_PAGE_SIZE),
      query,
    },
  )

  watchTotalPages(() => data.value?.pagination.totalPages)

  const updateStatus = async (
    id: ApproveUserPayload,
    action: 'approve' | 'reject',
  ): Promise<Result<ApproveUserResponse, string>> => {
    let response: ApproveUserResponse

    try {
      response = await $fetch<ApproveUserResponse>(`/api/users/${id}/${action}`, {
        method: 'POST',
      })
    } catch {
      return {
        type: 'failure',
        error: `Something went wrong. Failed to ${action} user`,
      }
    }

    await refresh()

    return {
      type: 'success',
      data: response,
    }
  }

  const approveUser = (id: ApproveUserPayload) => updateStatus(id, 'approve')
  const rejectUser = (id: ApproveUserPayload) => updateStatus(id, 'reject')

  return {
    users: computed(() => data.value?.items ?? []),
    pagination: computed(
      () =>
        data.value?.pagination ??
        createEmptyPaginatedResponse<UserManagementUser>(page.value, DEFAULT_PAGE_SIZE).pagination,
    ),
    page,
    setPage,
    pending,
    error,
    refresh,
    approveUser,
    rejectUser,
  }
}
