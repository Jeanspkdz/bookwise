<template>
  <UContainer>
    <div class="text-secondary-200 flex items-center gap-x-28 py-20">
      <div class="flex-7/12">
        <h2 class="mb-5 text-5xl font-bold text-balance text-white">
          {{ book?.name ?? 'Featured Book' }}
        </h2>

        <div class="mb-5 flex gap-5">
          <p>
            By <span class="text-primary font-bold">{{ book?.author ?? '-' }}</span>
          </p>
          <p>
            Category <span class="text-primary font-bold">{{ book?.category ?? '-' }}</span>
          </p>
          <p class="flex items-center">
            <UIcon
              name="jpkdz-star"
              class="brightness-0 invert"
            />
            <span class="text-primary ml-1.5 font-bold">{{ book?.rating ?? '-' }}</span
            >/5
          </p>
        </div>

        <div class="mb-5 flex gap-5">
          <p>
            Total Books : <span class="text-primary font-bold"> {{ book?.totalBooks ?? 0 }}</span>
          </p>
          <p>
            Available Books :
            <span class="text-primary font-bold"> {{ book?.availableBooks ?? 0 }}</span>
          </p>
        </div>

        <p class="max-w-[60ch] text-pretty">
          {{ description }}
        </p>

        <UButton
          class="font-bebas mt-9 uppercase"
          icon="jpkdz:book"
          size="xl"
        >
          Borrow Book Request
        </UButton>
      </div>

      <div class="relative flex-5/12">
        <BookCatalogBookImage
          class="relative z-10 h-[385px] w-[277px]"
          :image-url="featuredBook?.imageUrl"
          :cover-color="featuredBook?.coverColor"
        />
        <BookCatalogBookImage
          class="absolute! top-0 left-[35%] h-[385px] w-[277px] translate-y-9 rotate-10 blur"
          :image-url="featuredBook?.imageUrl"
          :cover-color="featuredBook?.coverColor"
        />
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const props = defineProps<{
  featuredBook: Book | null
  pending?: boolean
}>()

const book = computed(() => props.featuredBook)

const description = computed(() => {
  if (props.pending) {
    return 'Loading featured book...'
  }

  return props.featuredBook?.description ?? 'No featured book available right now.'
})
</script>

<style scoped></style>
