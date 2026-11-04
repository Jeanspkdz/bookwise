<template>
  <UModal
    :close="false"
    :ui="{
      content: 'max-w-md',
      body: 'relative px-6 pb-6 pt-16 sm:px-8 sm:pb-8',
    }"
  >
    <UButton
      color="error"
      variant="soft"
      size="sm"
      icon="i-lucide-circle-x"
      :aria-label="`Reject request for ${props.user.name}`"
      title="Reject account request"
      class="size-8 justify-center px-0"
      :loading="props.loading"
    />

    <template #body="{ close }">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        aria-label="Close modal"
        class="absolute top-4 right-4"
        @click="close"
      />

      <div class="flex flex-col items-center text-center">
        <div class="bg-error/10 mb-8 rounded-full p-4">
          <div class="bg-error flex size-20 items-center justify-center rounded-full">
            <UIcon
              name="i-lucide-circle-x"
              class="size-8 text-white"
            />
          </div>
        </div>

        <h3 class="text-highlighted text-xl font-semibold">Reject Account Request</h3>
        <p class="text-toned mt-4 max-w-sm text-sm leading-6">
          Reject {{ props.user.name }}'s account request?
        </p>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        block
        color="error"
        size="xl"
        variant="soft"
        label="Reject Request"
        :loading="props.loading"
        @click="
          () => {
            emit('rejectUser', props.user.id)
            close()
          }
        "
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ user: UserManagementUser; loading: boolean }>()
const emit = defineEmits<{ rejectUser: [userId: UserManagementUser['id']] }>()
</script>
