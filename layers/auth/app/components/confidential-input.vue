<template>
  <UInput
    v-model="model"
    :type="isVisible ? 'text' : 'password'"
    v-bind="$attrs"
  >
    <template #trailing>
      <UButton
        type="button"
        color="neutral"
        variant="link"
        size="sm"
        :icon="isVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="isVisible ? 'Hide value' : 'Show value'"
        :aria-pressed="isVisible"
        @click="isVisible = !isVisible"
      />
    </template>
  </UInput>
</template>

<script setup lang="ts">
const model = defineModel<string>()

const isVisible = ref(false)
</script>

<style scoped></style>
