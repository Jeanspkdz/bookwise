<template>
  <div
    class="border-default bg-primary-50/40 grid gap-6 rounded-xl border p-4 lg:grid-cols-[160px_1fr] lg:items-start"
  >
    <NuxtImg
      :src="book.imageUrl"
      :alt="book.name"
      class="my-auto h-56 w-40 rounded-lg object-cover"
      sizes="160px"
    />

    <div class="space-y-5">
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <p class="text-toned flex items-center gap-2">
          <UIcon
            name="jpkdz-admin-calendar"
            class="size-4"
          />
          <span>Created:</span>
          <NuxtTime
            :datetime="book.createdAt"
            year="2-digit"
            month="2-digit"
            day="2-digit"
            locale="en"
          />
        </p>
        <p class="text-toned flex items-center gap-2">
          <UIcon
            name="i-lucide-clock-3"
            class="size-4"
          />
          <span>Updated:</span>
          <NuxtTime
            :datetime="book.updatedAt"
            year="2-digit"
            month="2-digit"
            day="2-digit"
            locale="en"
          />
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-highlighted text-2xl font-semibold sm:text-3xl">{{ book.name }}</h3>
        <p class="text-highlighted text-lg font-semibold">By {{ book.author }}</p>
        <p class="text-toned text-sm leading-6">{{ book.description }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UBadge
          color="neutral"
          variant="subtle"
          :label="book.category"
        />
        <UBadge
          color="warning"
          variant="subtle"
          :label="`Rating: ${book.rating.toFixed(1)} / 5`"
        />
        <UBadge
          :color="availability.color"
          variant="subtle"
          :label="availability.label"
        />
      </div>

      <div>
        <UButton
          icon="jpkdz-admin-edit"
          label="Edit Book"
          color="primary"
          class="w-full justify-center sm:w-60"
          :to="`/dashboard/book/${book.id}/update`"
          :ui="{
            leadingIcon: 'invert brightness-0 size-3',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { book } = defineProps<{
  book: Book
}>()

const availability = computed(() => {
  const availableBooks = book.availableBooks ?? 0

  if (availableBooks <= 0) {
    return {
      color: 'error',
      label: 'Out of stock',
    } as const
  }

  if (availableBooks <= 2) {
    return {
      color: 'warning',
      label: 'Low stock',
    } as const
  }

  return {
    color: 'success',
    label: 'In stock',
  } as const
})
</script>
