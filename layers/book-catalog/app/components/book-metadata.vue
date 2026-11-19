<template>
  <div>
    <div class="mb-5 flex flex-wrap gap-5">
      <p>
        By <span class="text-primary font-bold">{{ book?.author ?? '-' }}</span>
      </p>
      <p>
        Category <span class="text-primary font-bold">{{ book?.category ?? '-' }}</span>
      </p>
      <p class="flex items-center">
        <UIcon
          name="jpkdz-star"
          class="brightness-0 invert"
        />
        <span class="text-primary ml-1.5 font-bold">{{ book?.rating ?? '-' }}</span
        >/5
      </p>
    </div>

    <div class="mb-5 flex gap-5">
      <p>
        Total Books : <span class="text-primary font-bold"> {{ book?.totalBooks ?? 0 }}</span>
      </p>
      <p>
        Available Books :
        <span class="text-primary font-bold"> {{ book?.availableBooks ?? 0 }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ book: Book | null }>()
</script>
