import type { Result } from '~~/layers/shared/shared/types/result'

export function useBooks() {
  const { data, pending, error } = useFetch<Book[]>('/api/book', {
    method: 'GET',
    key: 'admin-books',
    lazy: true,
    default: () => [],
  })
  const { startUpload: startImageUpload } = useUploadThing('imageUploaders')
  const { startUpload: startVideoUpload } = useUploadThing('videoUploaders')

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
      const response = await $fetch(`/api/book/${id}`, {
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
    createBook,
    deleteBook,
  }
}
