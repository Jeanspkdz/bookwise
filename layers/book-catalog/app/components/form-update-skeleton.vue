<template>
  <div class="border-default mx-auto w-xl space-y-5 rounded-2xl border bg-white p-5 shadow-xl">
    <div
      v-for="field in fieldWidths"
      :key="field.label"
      class="space-y-2"
    >
      <USkeleton
        class="h-4"
        :class="field.label"
      />
      <USkeleton
        class="h-9 w-full rounded-md"
        :class="field.input"
      />
    </div>

    <div class="flex gap-4">
      <div
        v-for="field in numericFields"
        :key="field"
        class="flex-1/2 space-y-2"
      >
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-9 w-full rounded-md" />
      </div>
    </div>

    <div class="space-y-2">
      <USkeleton class="h-4 w-24" />
      <div class="flex justify-center">
        <USkeleton class="h-6 w-28 rounded-md" />
      </div>
      <USkeleton class="h-36 w-full rounded-lg" />
    </div>

    <div class="space-y-2">
      <USkeleton class="h-4 w-32" />
      <USkeleton class="h-9 w-32 rounded-md" />
    </div>

    <div class="space-y-2">
      <USkeleton class="h-4 w-24" />
      <div class="flex justify-center">
        <USkeleton class="h-6 w-28 rounded-md" />
      </div>
      <USkeleton class="h-36 w-full rounded-lg" />
    </div>

    <div class="space-y-2">
      <USkeleton class="h-4 w-28" />
      <USkeleton class="h-40 w-full rounded-md" />
    </div>

    <USkeleton class="h-9 w-full rounded-md" />
  </div>
</template>

<script setup lang="ts">
const fieldWidths = [
  {
    label: 'w-20',
    input: '',
  },
  {
    label: 'w-16',
    input: '',
  },
  {
    label: 'w-14',
    input: '',
  },
  {
    label: 'w-24',
    input: 'h-24',
  },
]

const numericFields = ['rating', 'totalBooks']
</script>
