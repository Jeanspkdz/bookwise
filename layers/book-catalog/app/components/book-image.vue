<template>
  <div class="h-[385px] w-[277px]">
    <SharedBookCover
      color="#1d2a4a"
      class="h-full w-full"
    />
    <NuxtImg
      alt="Book cover image"
      sizes="200px md:240px lg:277px"
      src="/book-cover.webp"
      class="absolute top-0 right-0 h-[88%] w-[88%]"
    />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
