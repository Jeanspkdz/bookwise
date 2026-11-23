<template>
  <UMain>
    <UContainer class="pb-20 md:pb-24">
      <section class="mx-auto max-w-3xl pt-16 text-center md:pt-20">
        <p class="text-secondary-200 text-sm font-semibold tracking-[0.12em] uppercase md:text-lg">
          Discover your next great read:
        </p>
        <h1
          class="mt-5 text-4xl leading-tight font-semibold tracking-normal text-white md:text-6xl"
        >
          Explore and Search for<br class="hidden sm:block" />
          <span class="text-primary">Any Book</span> In Our Library
        </h1>
        <UInput
          v-model="search"
          aria-label="Search the library"
          placeholder="Search by title, author, or category"
          icon="i-lucide-search"
          :maxlength="200"
          size="xl"
          class="mt-8 w-full max-w-[630px] text-left"
          :ui="{
            base: 'h-[68px] rounded-xl bg-secondary-800 pl-14 text-lg text-white ring-0 focus-visible:ring-2 focus-visible:ring-primary',
            leading: 'pl-5',
            leadingIcon: 'size-6 text-primary',
          }"
        />
      </section>

      <section
        class="mt-16 md:mt-20"
        aria-labelledby="search-results-title"
      >
        <div class="mb-10 flex flex-wrap items-center justify-between gap-4">
          <h2
            id="search-results-title"
            class="text-secondary-200 text-3xl font-semibold"
          >
            <template v-if="appliedSearch">
              Search Result for <span class="text-primary">{{ appliedSearch }}</span>
            </template>
            <template v-else>Search Results</template>
          </h2>
          <div class="bg-secondary-800 flex items-center gap-2 rounded px-4 py-1">
            <label
              for="search-field"
              class="text-secondary-200 text-sm"
              >Filter by:</label
            >
            <USelect
              id="search-field"
              v-model="searchBy"
              :items="searchFields"
              variant="none"
              class="w-32"
              :ui="{ base: 'text-primary font-semibold' }"
            />
          </div>
        </div>

        <div
          aria-live="polite"
          :aria-busy="pending"
        >
          <SharedAsyncState
            :pending="pending"
            :error="error"
            error-title="Unable to load search results"
            @refresh="refresh"
          >
            <template #pending>
              <div class="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-9">
                <article
                  v-for="item in 12"
                  :key="item"
                  class="w-[170px]"
                >
                  <USkeleton class="h-[238px] rounded-xl" />
                  <USkeleton class="mt-5 h-6 w-full" />
                  <USkeleton class="mt-2 h-4 w-2/3" />
                </article>
              </div>
            </template>
            <template v-if="books.length">
              <BookCatalogBookGrid
                :books="books"
                show-author
              />
              <div class="mt-12 flex justify-end border-t border-white/10 pt-6">
                <UPagination
                  v-model:page="page"
                  :items-per-page="pagination.pageSize"
                  :total="pagination.totalItems"
                  :sibling-count="1"
                  :ui="{ first: 'hidden', last: 'hidden' }"
                  show-edges
                  size="lg"
                  active-color="primary"
                />
              </div>
            </template>
            <BookCatalogBookSearchEmpty
              v-else
              @clear="clearSearch"
            />
          </SharedAsyncState>
        </div>
      </section>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'home-layout' })
useSeoMeta({ title: 'Search books | BookWise' })

const {
  search,
  appliedSearch,
  clearSearch,
  searchBy,
  page,
  books,
  pagination,
  pending,
  error,
  refresh,
} = useBooks({ search: true, syncToUrl: true, pageSize: 12, sort: 'name' })
const searchFields = [
  { label: 'All fields', value: 'all' },
  { label: 'Title', value: 'name' },
  { label: 'Author', value: 'author' },
  { label: 'Category', value: 'category' },
]
</script>
