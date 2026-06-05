<template>
  <div class="flex flex-7/12 flex-col gap-4">
    <UBadge
      color="warning"
      variant="subtle"
      icon="i-tabler-alert-triangle"
      class="w-fit"
    >
      Something went wrong
    </UBadge>

    <h2 class="text-5xl font-bold text-white">Couldn't load this book</h2>

    <p class="max-w-[48ch] text-white/50">
      There was a problem connecting to the server. This is temporary — please try again.
    </p>

    <div class="mt-2 flex gap-3">
      <UButton
        class="font-bebas uppercase"
        icon="i-tabler-refresh"
        size="xl"
        @click="emit('refresh')"
      >
        Try again
      </UButton>
    </div>
  </div>

  <div class="flex flex-5/12 items-center justify-center">
    <div
      class="flex h-[385px] w-[277px] flex-col items-center justify-center gap-3 rounded-lg border border-white/7 bg-white/4"
    >
      <UIcon
        name="i-tabler-server-off"
        class="size-11 text-white/15"
      />
      <span class="text-xs text-white/20">No book data</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  refresh: []
}>()
</script>
