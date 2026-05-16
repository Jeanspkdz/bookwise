<template>
  <UContainer class="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
    <div class="flex-1/2">
      <div v-if="!user">Oops, soemtign wenh twrong</div>
      <div v-else>
        <ProfileCard
          :username="user.name"
          :student-code="user.studentCode"
          :address="user.address"
          :is-account-approved="user.isApproved"
          :email="user.email"
          :phone-number="user.phoneNumber"
          class="mx-auto"
        />
      </div>
    </div>

    <div class="flex-1/2"></div>
  </UContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~~/layers/shared/app/stores/userStore'

definePageMeta({
  layout: {
    name: 'home-layout',
  },
})

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

await callOnce('profile-user', async () => {
  await userStore.getUser()
})
</script>

<style scoped></style>
