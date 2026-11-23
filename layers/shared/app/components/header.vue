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
      <div class="hidden items-center gap-3 md:flex">
        <UNavigationMenu
          variant="link"
          :items="desktopNavItems"
          :ui="{
            link: 'hover:text-primary',
          }"
        >
          <template #cta="{ item }: { item: NavigationMenuItem }">
            <UButton :label="item.label" />
          </template>
        </UNavigationMenu>

        <UDropdownMenu
          v-if="username"
          :items="avatarMenuItems"
          :content="{
            align: 'end',
            side: 'bottom',
            sideOffset: 12,
          }"
          :ui="{
            content: 'min-w-40',
          }"
        >
          <UButton
            variant="ghost"
            color="neutral"
            class="rounded-full p-0 hover:bg-transparent"
            :ui="{
              base: 'rounded-full',
            }"
          >
            <UAvatar
              :alt="username"
              size="lg"
              :ui="{
                root: 'border-primary-500/20 border',
              }"
            />
          </UButton>
        </UDropdownMenu>
      </div>
    </template>

    <template #body>
      <UNavigationMenu
        :highlight="true"
        :items="mobileNavItems"
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
import type { LogoutEventHandler } from '~~/layers/auth/app/utils/types'

const { currentPath, username } = defineProps<{
  currentPath: string
  username: string | undefined
}>()

const emit = defineEmits<{
  logout: Parameters<LogoutEventHandler>
}>()

const desktopNavItems = computed(() => {
  const items: NavigationMenuItem[] = [
    {
      label: 'Home',
      to: '/',
      active: currentPath === '/',
    },
    {
      label: 'Search',
      to: '/search',
      active: currentPath.startsWith('/search'),
    },
  ]

  if (!username) {
    items.push({
      label: 'Log In',
      to: '/auth/login',
      slot: 'cta' as const,
    })
  }

  return items
})

const avatarMenuItems = computed(() => [[
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    to: '/profile',
  },
  {
    label: 'Logout',
    icon: 'i-lucide-log-out',
    onSelect: (event: Event) => {
      handleLogoutSelect(event)
    },
  },
]])

const mobileNavItems = computed(() => {
  const items = [...desktopNavItems.value]

  if (username) {
    items.push(
      {
        label: 'Profile',
        to: '/profile',
        icon: 'i-lucide-user',
      },
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        onSelect: (event: Event) => {
          handleLogoutSelect(event)
        },
      },
    )
  }

  return items
})

const handleLogoutSelect = (event: Event) => {
  event.preventDefault()
  emit('logout')
}
</script>

<style scoped></style>
