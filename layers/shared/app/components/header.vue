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
        <template #cta="{ item }: { item: NavigationMenuItem }">
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

const { currentPath, username } = defineProps<{
  currentPath: string
  username: string | undefined
}>()

const navItems = computed(() => {
  const items: NavigationMenuItem[] = [
    {
      label: 'Home',
      to: '/',
      active: currentPath === '/',
    },
    {
      label: 'Search',
      to: '#',
      active: currentPath.startsWith('/search'),
    },
  ]

  if (username) {
    items.push({
      avatar: {
        alt: username,
        size: 'lg',
        ui: {
          root: 'border-primary-500/20 border-1',
        },
      },
      to: '/profile',
    })

    return items
  }

  items.push({
    label: 'Log In',
    to: '/auth/login',
    slot: 'cta' as const,
  })

  return items
})
</script>

<style scoped></style>
