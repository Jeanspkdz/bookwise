<template>
  <div class="min-w-[860px] w-full overflow-x-auto rounded-xl border border-default">
    <div class="bg-primary-50 grid grid-cols-[minmax(260px,2.4fr)_minmax(180px,1.5fr)_minmax(160px,1.2fr)_minmax(160px,1.2fr)_120px] border-b border-default">
      <div
        v-for="header in tableHeaders"
        :key="header"
        class="px-4 py-3 text-sm font-medium text-default"
      >
        {{ header }}
      </div>
    </div>

    <div
      v-for="row in skeletonRows"
      :key="row"
      class="grid grid-cols-[minmax(260px,2.4fr)_minmax(180px,1.5fr)_minmax(160px,1.2fr)_minmax(160px,1.2fr)_120px] items-center border-b border-default px-4 py-4 last:border-b-0"
    >
      <div class="flex items-center gap-3">
        <USkeleton class="h-10 w-8 rounded-sm" />
        <USkeleton class="h-4 w-40" />
      </div>
      <USkeleton class="h-4 w-28" />
      <USkeleton class="h-4 w-24" />
      <USkeleton class="h-4 w-28" />
      <div class="flex items-center gap-2">
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
