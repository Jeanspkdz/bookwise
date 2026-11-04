<template>
  <div class="border-default w-full min-w-[860px] overflow-x-auto rounded-xl border">
    <div
      class="bg-primary-50 border-default grid grid-cols-[32fr_20fr_18fr_16fr_14fr] border-b"
    >
      <div
        v-for="header in tableHeaders"
        :key="header"
        class="text-default flex items-center px-4 py-3 text-sm font-medium"
      >
        <UButton
          v-if="header !== 'Action'"
          color="neutral"
          variant="ghost"
          :label="header"
          leading-icon="i-lucide-arrow-up-down"
          class="pointer-events-none -mx-2"
          tabindex="-1"
          aria-hidden="true"
        />
        <span v-else>{{ header }}</span>
      </div>
    </div>

    <div
      v-for="row in skeletonRows"
      :key="row"
      class="border-default grid grid-cols-[32fr_20fr_18fr_16fr_14fr] items-center border-b py-4 last:border-b-0"
    >
      <div class="flex items-center gap-3 px-4">
        <USkeleton class="h-10 w-8 rounded-sm" />
        <USkeleton class="h-4 min-w-0 w-40 max-w-full flex-1" />
      </div>
      <div class="px-4">
        <USkeleton class="h-4 w-28 max-w-full" />
      </div>
      <div class="px-4">
        <USkeleton class="h-4 w-24 max-w-full" />
      </div>
      <div class="px-4">
        <USkeleton class="h-4 w-28 max-w-full" />
      </div>
      <div class="flex items-center gap-2 px-4">
        <USkeleton class="h-8 w-8 rounded-md" />
        <USkeleton class="h-8 w-8 rounded-md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const tableHeaders = ['Book Title', 'Author', 'Genre', 'Date Created', 'Action']
const skeletonRows = 6
</script>
