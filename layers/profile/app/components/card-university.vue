<template>
  <div
    class="card-bg dot-pattern relative w-full max-w-[600px] overflow-hidden rounded-2xl border border-[#1e3a4a] shadow-2xl"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-linear-to-br from-[#0a3a3a]/40 via-transparent to-[#051a30]/60"
    />

    <div
      class="relative z-10 flex flex-col items-center border-b border-white/5 px-6 pt-6 pb-4 text-center"
    >
      <h1 class="text-2xl font-bold tracking-tight text-white">
        {{ universityName }}
      </h1>
      <p class="mt-1 text-sm text-[#6a9aaa]">
        {{ universityTagline }}
      </p>
    </div>

    <div class="relative z-10 flex flex-col gap-5 px-6 py-5 sm:flex-row">
      <div
        class="mx-auto flex h-[150px] w-[130px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#3a2a7a] bg-linear-to-br from-[#3a1a6a] to-[#1a0a3a] text-5xl shadow-lg sm:mx-0"
      >
        <NuxtImg
          src="/university-profile-photo.png"
          alt="Student photo"
          class="h-full w-full object-cover"
        />
      </div>

      <div class="flex flex-1 flex-col justify-center gap-2">
        <div class="flex items-baseline gap-2 text-sm">
          <span class="w-28 shrink-0 text-[#8aaabb]">Student ID</span>
          <span class="text-[#8aaabb]">:</span>
          <span class="font-bold text-white">{{ studentId }}</span>
        </div>
        <div class="flex items-baseline gap-2 text-sm">
          <span class="w-28 shrink-0 text-[#8aaabb]">Full Name</span>
          <span class="text-[#8aaabb]">:</span>
          <span class="font-bold text-white">{{ fullname }}</span>
        </div>
        <div class="flex items-baseline gap-2 text-sm">
          <span class="w-28 shrink-0 text-[#8aaabb]">Department</span>
          <span class="text-[#8aaabb]">:</span>
          <span class="font-bold text-white">{{ department }}</span>
        </div>
        <div class="flex items-baseline gap-2 text-sm">
          <span class="w-28 shrink-0 text-[#8aaabb]">Date of Birth</span>
          <span class="text-[#8aaabb]">:</span>
          <span class="font-bold text-white">{{ dateOfBirth }}</span>
        </div>
        <div class="flex items-baseline gap-2 text-sm">
          <span class="w-28 shrink-0 text-[#8aaabb]">Contact no</span>
          <span class="text-[#8aaabb]">:</span>
          <span class="font-bold text-white">{{ contactNumber }}</span>
        </div>
      </div>
    </div>

    <div
      class="relative z-10 flex flex-col gap-1 border-t border-white/5 px-6 py-3 text-[11px] text-[#4a6a7a] sm:flex-row sm:items-center sm:justify-between sm:gap-3"
    >
      <span
        >University No: <strong class="text-[#6a9aaa]">{{ universityPhone }}</strong></span
      >
      <span
        >Website: <strong class="text-[#6a9aaa]">{{ universityWebsite }}</strong></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  studentId = 'Not provided',
  fullname = 'Not provided',
  department = 'Web Development',
  dateOfBirth = '--/--/----',
  contactNumber = 'Not provided',
  universityName = 'Dev University',
  universityTagline = 'If you can imaginiog ti you can build it',
  universityPhone = '+1 (800) 456-7890',
  universityWebsite = 'www.bookwise.com',
} = defineProps<{
  studentId?: string
  fullname?: string
  department?: string
  dateOfBirth?: string
  contactNumber?: string
  universityName?: string
  universityTagline?: string
  universityPhone?: string
  universityWebsite?: string
}>()
</script>

<style scoped>
.card-bg {
  background: radial-gradient(ellipse at top left, #1a1a4e 0%, #0f1a2e 40%, #0a1f1e 100%);
}
</style>
