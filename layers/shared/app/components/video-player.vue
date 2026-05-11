<template>
  <media-player
    :title="title"
    :src="playerSrc"
    :cross-origin="crossOrigin"
    :plays-inline="playsInline"
  >
    <ClientOnly>
      <media-provider></media-provider>
      <media-audio-layout />
      <media-video-layout />
    </ClientOnly>
  </media-player>
</template>

<script setup lang="ts">
import 'vidstack/bundle'

const {
  title = 'Book preview',
  crossOrigin = true,
  playsInline = true,
  type = 'video/mp4',
  src,
} = defineProps<{
  src: string
  type?: string
  title?: string
  crossOrigin?: boolean
  playsInline?: boolean
}>()

const playerSrc = computed(() => ({
  src,
  type,
}))
</script>

<style scoped></style>
