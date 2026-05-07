import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { UpdateBookPayload } from '~~/layers/book-catalog/app/utils/types'
import type { Result } from '~~/layers/shared/shared/types/result'

export function useBook(id: MaybeRefOrGetter<Book['id']>) {
  const bookId = computed(() => toValue(id))
  const { startUpload: startImageUpload } = useUploadThing('imageUploaders')
  const { startUpload: startVideoUpload } = useUploadThing('videoUploaders')

  const {
    data: book,
    pending,
    error,
    refresh,
  } = useFetch<Book | null>(() => `/api/book/${bookId.value}`, {
    method: 'GET',
    key: () => `admin-book-${bookId.value}`,
    lazy: true,
    default: () => null,
    watch: [bookId],
  })

  const updateBook = async (
    payload: UpdateBookPayload,
  ): Promise<Result<UpdateBookResponse, string>> => {
    const resolvedId = bookId.value
    try {
      if (!book.value) {
        return {
          type: 'failure',
          error: 'Book Not Found',
        }
      }

      let imageUrl = book.value.imageUrl
      let videoUrl = book.value.videoUrl

      if (payload.bookImage) {
        const imageUploadResult = await startImageUpload([payload.bookImage])
        const uploadedImageUrl = imageUploadResult?.[0]?.ufsUrl

        if (!uploadedImageUrl) {
          return {
            type: 'failure',
            error: 'Book Image could not be uploaded',
          }
        }

        imageUrl = uploadedImageUrl
      }

      if (payload.bookVideo) {
        const videoUploadResult = await startVideoUpload([payload.bookVideo])
        const uploadedVideoUrl = videoUploadResult?.[0]?.ufsUrl

        if (!uploadedVideoUrl) {
          return {
            type: 'failure',
            error: 'Book Video could not be uploaded',
          }
        }

        videoUrl = uploadedVideoUrl
      }

      const response = await $fetch(`/api/book/${resolvedId}`, {
        method: 'PUT',
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

      book.value = response.updatedBook

      return {
        type: 'success',
        data: response,
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to update book',
      }
    }
  }

  return {
    book,
    pending,
    error,
    updateBook,
    refresh,
  }
}
