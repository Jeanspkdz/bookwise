<template>
  <UDashboardPanel
    id="update-book"
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
            <h2 class="text-xl font-semibold sm:text-2xl">Update Book</h2>
            <p class="text-toned">Update the details of this book in your catalog</p>
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

      <div
        v-if="pending"
        class="mx-auto mt-6 w-xl"
      >
        <USkeleton class="h-10 w-full" />
      </div>

      <div
        v-else-if="!book"
        class="mx-auto mt-6 w-xl"
      >
        <UAlert
          color="error"
          icon="i-lucide-triangle-alert"
          title="Unable to load book"
          description="The requested book was not found."
        />
      </div>

      <BookCatalogFormUpdate
        v-else
        :initial-values="{
          name: book.name,
          author: book.author,
          category: book.category,
          description: book.description,
          rating: book.rating,
          totalBooks: book.totalBooks,
          coverColor: book.coverColor,
          summary: book.summary,
          imageUrl: book.imageUrl,
          videoUrl: book.videoUrl,
        }"
        @update="handleUpdateBook"
      />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})

const route = useRoute()
const toast = useToast()
const bookId = computed(() => String(route.params.id ?? ''))
const { book, pending, updateBook } = useBook(bookId)

const handleUpdateBook: UpdateBookEventHandler = async (payload) => {
  if (!book.value) {
    return
  }

  const result = await updateBook({
    ...payload,
  })

  if (result.type === 'success') {
    toast.add({
      title: 'Book updated',
      description: result.data.updatedBook.name,
      color: 'success',
    })
    return
  }

  toast.add({
    title: 'Book update failed',
    description: result.error,
    color: 'error',
  })
}
</script>

<style scoped></style>
