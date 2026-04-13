export interface BookItem {
  id: string
  name: string
  author: string
  category: string
  imageUrl: string
  createdAt: string
}

export function useBooks() {
  const { data, pending, error } = useFetch<BookItem[]>('/api/book', {
    method: 'GET',
    key: 'admin-books',
    lazy: true,
    default: () => [],
  })

  return {
    books: computed(() => data.value ?? []),
    pending,
    error,
  }
}
