<template>
  <main class="font-plex relative flex min-h-screen overflow-hidden">
    <div class="hidden flex-1/2 bg-[url('/auth-illustration.png')] bg-cover bg-center md:block" />

    <div
      class="-order-1 grid min-h-full flex-1/2 place-content-center bg-gradient-to-b from-[#12141D] to-[#12151F]"
    >
      <div
        class="mx-auto my-auto h-full w-10/12 max-w-[650px] px-4 py-6 text-white md:px-8 md:py-12"
      >
        <div class="mb-8 flex items-center gap-2 text-2xl font-bold">
          <UIcon
            name="jpkdz-logo"
            class="size-8"
          />
          <h1>
            <NuxtLink to="/"> BookWise </NuxtLink>
          </h1>
        </div>

        <div class="mb-9">
          <h1 class="text-2xl font-bold">{{ title }}</h1>
          <p class="text-muted max-w-[55ch] text-lg">
            {{ description }}
          </p>
        </div>

        <slot />

        <div>
          <p class="text-muted mt-6 text-center text-sm">
            {{ footerText }}
            <NuxtLink
              :to="footerLinkTo"
              class="text-primary font-medium hover:underline"
            >
              {{ footerLinkText }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  footerText: string
  footerLinkText: string
  footerLinkTo: string
}>()
</script>

<style scoped></style>
