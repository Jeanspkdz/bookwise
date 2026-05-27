import type { Result } from '~~/layers/shared/shared/types/result'

export function useBooks() {
  const { data, pending, error } = useFetch<Book[]>('/api/book', {
    method: 'GET',
    key: 'admin-books',
    lazy: true,
    default: () => [],
  })

  const { startUpload: startImageUpload } = useUploadThing('bookImage')
  const { startUpload: startVideoUpload } = useUploadThing('bookVideo')

  const getBooks = async (): Promise<Result<Book[], string>> => {
    try {
      const response = await $fetch<Book[]>('/api/book', {
        method: 'GET',
      })

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to get books',
      }
    }
  }

  const getBookById = async (id: Book['id']): Promise<Result<Book, string>> => {
    try {
      const response = await $fetch<Book>(`/api/book/${id}`, {
        method: 'GET',
      })

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to get book',
      }
    }
  }

  const getFeaturedBook = async (): Promise<Result<GetFeaturedBookResponse, string>> => {
    try {
      const response = await $fetch<GetFeaturedBookResponse>('/api/book?featured=true', {
        method: 'GET',
      })

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to get featured book',
      }
    }
  }

  const getPopularBooks = async (): Promise<Result<GetPopularBooksResponse, string>> => {
    try {
      const response = await $fetch<GetPopularBooksResponse>('/api/book?sort=popular', {
        method: 'GET',
      })

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to get popular books',
      }
    }
  }

  const createBook = async (
    payload: CreateBookPayload,
  ): Promise<Result<CreateBookResponse, string>> => {
    try {
      const [imageUploadResult, videoUploadResult] = await Promise.all([
        startImageUpload([payload.bookImage]),
        startVideoUpload([payload.bookVideo]),
      ])

      const imageUrl = imageUploadResult?.[0]?.ufsUrl
      const videoUrl = videoUploadResult?.[0]?.ufsUrl

      const response = await $fetch('/api/book', {
        method: 'POST',
        body: {
          name: payload.name,
          description: payload.description,
          summary: payload.summary,
          author: payload.author,
          category: payload.category,
          rating: payload.rating,
          totalBooks: payload.totalBooks,
          availableBooks: payload.totalBooks,
          imageUrl,
          videoUrl,
          coverColor: payload.coverColor,
        },
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

  const deleteBook = async (id: DeleteBookPayload): Promise<Result<DeleteBookResponse, string>> => {
    try {
      const response = await $fetch<DeleteBookResponse>(`/api/book/${id}`, {
        method: 'DELETE',
      })

      data.value = (data.value ?? []).filter((book) => book.id !== response.deletedBook.id)

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to delete book',
      }
    }
  }

  return {
    books: computed(() => data.value ?? []),
    pending,
    error,
    getBooks,
    getBookById,
    getFeaturedBook,
    getPopularBooks,
    createBook,
    deleteBook,
  }
}
