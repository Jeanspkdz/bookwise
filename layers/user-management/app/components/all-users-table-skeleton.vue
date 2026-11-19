<template>
  <div class="border-default w-full min-w-[1120px] overflow-x-auto rounded-xl border">
    <div class="bg-primary-50 border-default grid grid-cols-7 border-b">
      <div
        v-for="header in sortableHeaders"
        :key="header"
        class="text-default flex items-center px-4 py-3 text-sm font-medium"
      >
        <UButton
          color="neutral"
          variant="ghost"
          :label="header"
          leading-icon="i-lucide-arrow-up-down"
          class="pointer-events-none -mx-2"
          tabindex="-1"
          aria-hidden="true"
        />
      </div>
    </div>

    <div
      v-for="row in skeletonRows"
      :key="row"
      class="border-default grid grid-cols-7 items-center border-b py-4 last:border-b-0"
    >
      <div class="flex min-w-0 items-center gap-3 px-4">
        <USkeleton class="size-10 shrink-0 rounded-full" />
        <div class="min-w-0 flex-1 space-y-2">
          <USkeleton class="h-3.5 w-32 max-w-full" />
          <USkeleton class="h-3 w-40 max-w-full" />
        </div>
      </div>
      <div class="px-4"><USkeleton class="h-4 w-24 max-w-full" /></div>
      <div class="px-4"><USkeleton class="h-6 w-16 rounded-full" /></div>
      <div class="px-4"><USkeleton class="h-4 w-28 max-w-full" /></div>
      <div class="px-4"><USkeleton class="h-4 w-24 max-w-full" /></div>
      <div class="px-4"><USkeleton class="h-4 w-36 max-w-full" /></div>
      <div class="px-4"><USkeleton class="h-6 w-20 rounded-full" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sortableHeaders = [
  'Name',
  'Date Joined',
  'Role',
  'Phone Number',
  'Student Code',
  'Address',
  'Account Status',
]
const skeletonRows = 6
</script>
