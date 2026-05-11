<template>
  <UDashboardPanel
    id="book-detail"
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
            <h2 class="text-xl font-semibold sm:text-2xl">Book<span> Details</span></h2>
            <p class="text-toned">View and manage complete information about this book</p>
          </div>
        </template>
        <template #right>
          <UDashboardSearchButton
            class="hidden justify-start md:flex md:w-full lg:w-[450px]"
            label="Search users, books by title, author, or genre."
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-4">
        <UButton
          size="md"
          label="Go Back"
          icon="i-lucide-arrow-left"
          @click="$router.back()"
        />

        <div v-if="pending">
          <BookCatalogBookDetailSkeleton />
        </div>

        <div v-else-if="error || !book">
          <BookCatalogBookDetailError />
        </div>

        <div
          v-else
          class="space-y-6 rounded-xl bg-white p-5"
        >
          <BookCatalogBookDetailHero :book="book" />

          <BookCatalogBookDetailContent
            :book="book"
            :summary-paragraphs="summaryParagraphs"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})

const route = useRoute()

const bookId = computed(() => String(route.params.id ?? ''))
const { book, pending, error } = useBook(bookId)

const summaryParagraphs = computed(() => {
  if (!book.value) {
    return []
  }

  const paragraphs = book.value.summary
    .split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  if (paragraphs.length) {
    return paragraphs
  }

  return [book.value.summary]
})
</script>

<style scoped></style>
