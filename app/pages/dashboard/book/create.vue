<template>
  <UDashboardPanel
    id="create-book"
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
            <h2 class="text-xl font-semibold sm:text-2xl">Create New Book</h2>
            <p class="text-toned">Fill in the details to add a new book to your catalog</p>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div>
        <UButton
          label="Go Back"
          size="md"
          icon="i-lucide-arrow-left"
          @click="$router.back()"
        />
      </div>

      <BookCatalogFormCreate @create="handleCreateBook" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})

interface CreateBookFormPayload {
  name: string
  description: string
  summary: string
  author: string
  category: string
  rating: number
  totalBooks: number
  coverColor: string
  bookImage: File
  bookVideo: File
}

const { createBook } = useBooks()
const { startUpload: startImageUpload } = useUploadThing('imageUploaders')
const { startUpload: startVideoUpload } = useUploadThing('videoUploaders')
const toast = useToast()

const handleCreateBook = async (payload: CreateBookFormPayload) => {
  const [imageUploadResult, videoUploadResult] = await Promise.all([
    startImageUpload([payload.bookImage]),
    startVideoUpload([payload.bookVideo]),
  ])

  const imageUrl = imageUploadResult?.[0]?.ufsUrl
  const videoUrl = videoUploadResult?.[0]?.ufsUrl

  if (!imageUrl || !videoUrl) {
    toast.add({
      title: 'Book creation failed',
      description: 'Image and video uploads are required',
      color: 'error',
    })
    return
  }

  const result = await createBook({
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
  })

  if (result.type === 'success') {
    toast.add({
      title: 'Book created',
      description: result.data.createdBook.name,
      color: 'success',
    })
    return
  }

  toast.add({
    title: 'Book creation failed',
    description: result.error,
    color: 'error',
  })
}
</script>

<style scoped></style>
