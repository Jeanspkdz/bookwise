<template>
  <UHeader mode="slideover">
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon
          name="jpkdz-logo"
          class="size-8"
        />
        <h1 class="hidden md:block">BookWise</h1>
      </div>
    </template>

    <template #right>
      <UNavigationMenu
        variant="link"
        :items="navItems"
        :ui="{
          link: 'hover:text-primary',
        }"
        class="hidden md:block"
      >
        <template #cta="{ item }">
          <UButton :label="item.label" />
        </template>
      </UNavigationMenu>
    </template>

    <template #body>
      <UNavigationMenu
        :highlight="true"
        :items="navItems"
        orientation="vertical"
        class="-mx-2.5"
        :ui="{
          list: 'space-y-2',
          link: 'px-4 py-3',
        }"
      />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { currentPath } = defineProps<{
  currentPath: string
}>()

const navItems = computed(
  () =>
    [
      {
        label: 'Home',
        to: '/',
        active: currentPath.startsWith('/'),
      },
      {
        label: 'Search',
        to: '#',
        active: currentPath.startsWith('/search'),
      },
      {
        label: 'Log In',
        to: '/auth/login',
        slot: 'cta' as const,
      },
    ] satisfies NavigationMenuItem[],
)
</script>

<style scoped></style>
