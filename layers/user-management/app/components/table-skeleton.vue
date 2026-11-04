<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-4">
      <USkeleton class="h-6 w-56" />
      <USkeleton class="h-9 w-40 rounded-md" />
    </div>

    <div class="max-w-full overflow-x-auto">
      <div class="min-w-[760px] overflow-hidden rounded-lg">
        <div
          class="bg-primary-50 grid grid-cols-[minmax(240px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(170px,1.2fr)]"
        >
          <div
            v-for="header in tableHeaders"
            :key="header.label"
            class="text-default flex items-center px-4 py-3 text-xs font-medium sm:text-sm"
          >
            <UButton
              v-if="header.columnId"
              color="neutral"
              variant="ghost"
              :label="header.label"
              :icon="getHeaderIcon(header.columnId)"
              class="pointer-events-none -mx-2"
              tabindex="-1"
              aria-hidden="true"
            />
            <span v-else class="-mx-2 inline-flex items-center px-2 py-1.5 text-sm">
              {{ header.label }}
            </span>
          </div>
        </div>

        <div
          v-for="row in skeletonRows"
          :key="row"
          class="border-default grid grid-cols-[minmax(240px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)_minmax(170px,1.2fr)] items-center border-b px-4 py-4 last:border-b-0"
        >
          <div class="flex items-center gap-3">
            <USkeleton class="size-9 rounded-full" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-36" />
              <USkeleton class="h-3 w-44" />
            </div>
          </div>
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-8 w-28 rounded-md" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortingState } from '@tanstack/vue-table'

const props = defineProps<{
  sorting: SortingState
}>()

const tableHeaders: { label: string; columnId?: string }[] = [
  { label: 'Name', columnId: 'name' },
  { label: 'Date Joined', columnId: 'dateJoined' },
  { label: 'University ID No', columnId: 'universityId' },
  { label: 'Actions' },
]
const skeletonRows = 4

const getHeaderIcon = (columnId: string) => {
  const sort = props.sorting.find(({ id }) => id === columnId)

  if (!sort) {
    return 'i-lucide-arrow-up-down'
  }

  return sort.desc ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-narrow-wide'
}
</script>
