<template>
  <UModal
    :close="false"
    :ui="{
      content: 'max-w-md',
      body: 'relative px-6 pb-6 pt-16 sm:px-8 sm:pb-8',
    }"
  >
    <UButton
      color="success"
      variant="solid"
      size="sm"
      icon="i-lucide-check"
      label="Approve Account"
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
        <div class="bg-success/10 mb-8 rounded-full p-4">
          <div class="bg-success flex size-20 items-center justify-center rounded-full">
            <UIcon
              name="i-lucide-circle-alert"
              class="size-8 text-white"
            />
          </div>
        </div>

        <h3 class="text-highlighted text-xl font-semibold">Approve Account Request</h3>
        <p class="text-toned mt-4 max-w-sm text-sm leading-6">
          Approve the student's account request and grant access. A confirmation email will be sent
          upon approval.
        </p>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        block
        color="success"
        size="xl"
        icon="i-lucide-check"
        label="Approve & Send Confirmation"
        :loading="props.loading"
        @click="
          () => {
            approveUser()
            close()
          }
        "
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: UserManagementUser
  loading: boolean
}>()

const emit = defineEmits<{
  approveUser: [userId: UserManagementUser['id']]
}>()

const approveUser = () => {
  emit('approveUser', props.user.id)
}
</script>
