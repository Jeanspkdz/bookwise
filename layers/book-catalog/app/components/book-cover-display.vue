<template>
  <div class="relative min-h-[430px] w-full max-w-[520px] shrink-0 overflow-visible lg:flex-5/12">
    <BookCatalogBookImage
      class="relative z-10 h-[385px] w-[277px]"
      :image-url="book?.imageUrl"
      :cover-color="book?.coverColor"
      :preload="preload"
    />
    <BookCatalogBookImage
      class="absolute! top-0 left-[35%] h-[385px] w-[277px] translate-y-9 rotate-10 blur"
      :image-url="book?.imageUrl"
      :cover-color="book?.coverColor"
    />
  </div>
</template>

<script setup lang="ts">
const { preload = false } = defineProps<{ book: Book | null; preload?: boolean }>()
</script>
