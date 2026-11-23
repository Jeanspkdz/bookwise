<template>
  <div class="flex flex-col items-center px-4 py-8 text-center md:py-12">
    <UIcon
      name="jpkdz-search-empty"
      class="size-40 shrink-0"
      aria-hidden="true"
    />
    <h3 class="mt-5 text-xl font-semibold text-white">No Results Found</h3>
    <p class="text-secondary-200 mt-2 text-sm leading-relaxed">
      We couldn't find any books matching your search.<br />
      Try using different keywords or check for typos.
    </p>
    <UButton
      label="Clear search"
      color="primary"
      size="lg"
      block
      class="font-bebas bg-primary-200 text-secondary-950 hover:bg-primary-300 mt-5 max-w-72 justify-center rounded-sm text-lg"
      @click="emit('clear')"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ clear: [] }>()
</script>
