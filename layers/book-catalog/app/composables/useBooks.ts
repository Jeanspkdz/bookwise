import type { Result } from '~~/layers/shared/shared/result'

export interface BookItem {
  id: string
  name: string
  author: string
  category: string
  imageUrl: string
  createdAt: string
}

export interface CreateBookInput {
  name: string
  description: string
  summary: string
  author: string
  category: string
  rating: number
  totalBooks: number
  availableBooks: number
  imageUrl: string
  videoUrl: string
  coverColor: string
}

export interface CreateBookResponse {
  createdBook: BookItem
}

export function useBooks() {
  const { data, pending, error } = useFetch<BookItem[]>('/api/book', {
    method: 'GET',
    key: 'admin-books',
    lazy: true,
    default: () => [],
  })

  const createBook = async (
    payload: CreateBookInput,
  ): Promise<Result<CreateBookResponse, string>> => {
    try {
      const response = await $fetch<CreateBookResponse>('/api/book', {
        method: 'POST',
        body: payload,
      })

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to create book',
      }
    }
  }

  return {
    books: computed(() => data.value ?? []),
    pending,
    error,
    createBook,
  }
}
