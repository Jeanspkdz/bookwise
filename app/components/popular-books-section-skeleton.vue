<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-9">
    <article
      v-for="item in skeletonItems"
      :key="item"
      class="w-[170px]"
    >
      <USkeleton class="h-[238px] w-[170px] rounded-xl" />

      <div class="mt-4 space-y-2">
        <USkeleton class="h-6 w-full" />
        <USkeleton class="h-4 w-2/3" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const skeletonItems = 6
</script>
