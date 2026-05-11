<template>
  <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
    <section class="space-y-3">
      <h4 class="text-highlighted text-lg font-semibold">Summary</h4>

      <p
        v-for="(paragraph, index) in summaryParagraphs"
        :key="`${book.id}-summary-${index}`"
        class="text-toned text-sm leading-7"
      >
        {{ paragraph }}
      </p>
    </section>

    <section class="space-y-3">
      <h4 class="text-highlighted text-lg font-semibold">Video</h4>

      <div class="border-default bg-primary-50 overflow-hidden rounded-xl border p-2">
        <SharedVideoPlayer
          :src="book.videoUrl"
          :title="book.name"
          type="video/mp4"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  book: Book
  summaryParagraphs: string[]
}>()
</script>
