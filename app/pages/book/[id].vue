<template>
  <UMain class="text-secondary-200 pb-24">
    <HeroSection
      :featured-book="book"
      :pending="pending"
      :error="error || (!pending && !book) ? 'The requested book could not be found.' : null"
      detail
      @refresh="refresh()"
    />

    <UContainer v-if="book && !pending && !error">
      <div class="grid items-start gap-16 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div class="min-w-0 space-y-12">
          <section aria-labelledby="book-video-title">
            <h2
              id="book-video-title"
              class="mb-5 text-3xl font-semibold"
            >
              Video
            </h2>
            <div
              v-if="book.videoUrl"
              class="overflow-hidden rounded-xl"
            >
              <SharedVideoPlayer
                :src="book.videoUrl"
                :title="`${book.name} preview`"
              />
            </div>
            <p v-else>No video is available for this book.</p>
          </section>

          <section aria-labelledby="book-summary-title">
            <h2
              id="book-summary-title"
              class="mb-5 text-3xl font-semibold"
            >
              Summary
            </h2>
            <div class="space-y-7 text-lg leading-8">
              <p
                v-for="(paragraph, index) in summaryParagraphs"
                :key="index"
              >
                {{ paragraph }}
              </p>
            </div>
          </section>
        </div>

        <section aria-labelledby="similar-books-title">
          <h2
            id="similar-books-title"
            class="mb-5 text-3xl font-semibold"
          >
            More similar books
          </h2>
          <SharedAsyncState
            :pending="similarPending"
            :error="similarError"
            error-title="Unable to load similar books"
            @refresh="refreshSimilar()"
          >
            <template #pending>
              <div
                class="grid grid-cols-3 gap-6"
                aria-label="Loading similar books"
                aria-busy="true"
              >
                <USkeleton
                  v-for="index in 6"
                  :key="index"
                  class="aspect-[145/200] w-full"
                />
              </div>
            </template>
            <div
              v-if="similarBooks.length"
              class="grid grid-cols-3 gap-x-5 gap-y-10 sm:gap-x-9"
            >
              <NuxtLink
                v-for="similarBook in similarBooks"
                :key="similarBook.id"
                :to="`/book/${similarBook.id}`"
                :aria-label="`${similarBook.name} by ${similarBook.author}`"
                class="focus-visible:outline-primary rounded-lg transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-8"
              >
                <BookCatalogBookImage
                  :image-url="similarBook.imageUrl"
                  :cover-color="similarBook.coverColor"
                  loading="lazy"
                  class="aspect-[145/200] w-full"
                />
              </NuxtLink>
            </div>
            <p v-else>No similar books are available yet.</p>
          </SharedAsyncState>
        </section>
      </div>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'home-layout' })

const route = useRoute()
const bookId = computed(() => String(route.params.id ?? ''))
const { book, pending, error, refresh } = useBookDetail(bookId, { lazy: false })
const {
  similarBooks,
  pending: similarPending,
  error: similarError,
  refresh: refreshSimilar,
} = useSimilarBooks(bookId, () => book.value?.category)
const summaryParagraphs = computed(
  () =>
    book.value?.summary
      .split(/\r?\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) || [],
)

useSeoMeta({
  title: () => (book.value ? `${book.value.name} | BookWise` : 'Book details | BookWise'),
  description: () => book.value?.description,
})
</script>
