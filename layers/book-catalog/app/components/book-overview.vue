<template>
  <div class="flex-7/12">
    <component
      :is="detail ? 'h1' : 'h2'"
      class="mb-5 text-5xl font-bold text-balance text-white lg:text-7xl"
    >
      {{ book?.name ?? 'Featured Book' }}
    </component>

    <BookCatalogBookMetadata :book="book" />

    <p class="max-w-[60ch] text-pretty">
      {{ description }}
    </p>

    <UButton
      class="font-bebas mt-9 uppercase"
      icon="jpkdz:book"
      size="xl"
      :to="detail ? undefined : `/book/${book?.id}`"
      :disabled="!book || (detail && book.availableBooks <= 0)"
      @click="detail && showBorrowInformation()"
    >
      {{
        detail
          ? book?.availableBooks
            ? 'Borrow Book Request'
            : 'Currently unavailable'
          : 'View Book Details'
      }}
    </UButton>
  </div>

  <BookCatalogBookCoverDisplay
    :book="book"
    :preload="true"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ book: Book | null; detail?: boolean }>()

const toast = useToast()
const showBorrowInformation = () => {
  toast.add({
    title: 'Borrow this book',
    description: 'Please contact the library to request this book.',
    color: 'info',
  })
}

const description = computed(
  () => props.book?.description ?? 'No featured book available right now.',
)
</script>
