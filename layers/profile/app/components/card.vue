<template>
  <div
    class="from-secondary-800 to-secondary-950 relative flex max-w-[520px] flex-col gap-y-8 rounded-[20px] bg-linear-to-b px-10 pt-15 pb-10"
  >
    <NuxtImg
      src="/hanging-tab.svg"
      class="absolute -top-3 right-0 left-0 mx-auto size-20"
    />

    <UUser
      class="mt-6"
      :name="username"
      size="3xl"
      :description="email"
      :avatar="{
        alt: username,
        ui: { root: 'size-25 ring-2 ring-primary mr-4' },
      }"
    >
      <template #name>
        <UTooltip
          :text="isAccountApproved ? 'Approved Account' : 'Pending Approval'"
          :delay-duration="400"
          arrow
          :content="{
            side: 'right',
          }"
        >
          <UIcon
            :name="isAccountApproved ? 'jpkdz-verified' : 'jpkdz-warning'"
            class="text-secondary-200 cursor-pointer"
          />
        </UTooltip>
        <span class="mt-1 block">{{ username }}</span>
      </template>
    </UUser>

    <div class="grid grid-cols-2 gap-8">
      <div>
        <h4 class="text-secondary-200 text-xl font-semibold">Student Code</h4>
        <span class="text-lg font-semibold text-white">{{ studentCode }}</span>
      </div>

      <div>
        <h4 class="text-secondary-200 text-xl font-semibold">Phone Number</h4>
        <span class="text-lg font-semibold text-white">{{ phoneNumber }}</span>
      </div>

      <div>
        <h4 class="text-secondary-200 text-xl font-semibold">Address</h4>
        <span class="text-lg font-semibold text-white">{{ address }}</span>
      </div>
    </div>

    <ProfileCardUniversity
      class="w-full items-stretch"
      :contact-number="phoneNumber"
      :student-id="studentCode"
      :fullname="username"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  username: string
  email: string
  studentCode: string
  phoneNumber: string
  address: string
  isAccountApproved: boolean
}>()
</script>

<style scoped></style>
