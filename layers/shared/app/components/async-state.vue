<template>
  <slot
    v-if="pending"
    name="pending"
  />
  <slot
    v-else-if="error"
    name="error"
    :error="error"
    :refresh="refresh"
  >
    <UEmpty
      icon="i-lucide-triangle-alert"
      :title="errorTitle"
      :description="typeof error === 'string' ? error : undefined"
      :actions="[{ label: 'Try again', icon: 'i-tabler-refresh', onClick: refresh }]"
    />
  </slot>
  <slot v-else />
</template>

<script setup lang="ts">
const {
  pending = false,
  error = null,
  errorTitle = 'Unable to load content',
} = defineProps<{
  pending?: boolean
  error?: string | boolean | Error | null
  errorTitle?: string
}>()
const emit = defineEmits<{ refresh: [] }>()
const refresh = () => emit('refresh')
</script>
