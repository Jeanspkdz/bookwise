<template>
  <UDashboardGroup storage="local">
    <UDashboardSidebar
      :ui="{
        footer: 'overflow-hidden',
        header: ' border-b border-muted',
      }"
      collapsible
      resizable
      :default-size="17"
      :min-size="15"
      :max-size="25"
      toggle-side="right"
    >
      <template #header="{ collapsed }">
        <template v-if="!collapsed">
          <div class="bg-primary grid aspect-square size-11 place-content-center rounded-full">
            <UIcon name="jpkdz-logo" />
          </div>
          <h1 class="text-primary max-w-full flex-1 truncate text-xl font-bold">BookWise</h1>
        </template>
        <div
          v-else
          class="bg-primary grid aspect-square w-full flex-1 place-content-center rounded-full"
        >
          <UIcon
            name="jpkdz-logo"
            class="size-4"
          />
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :ui="{
            list: 'space-y-4',
            link: `py-3 hover:bg-primary hover:text-white rounded-md`,
            linkLabel: `${collapsed ? 'hidden' : 'block'}`,
            linkLeadingIcon: 'group-hover:brightness-0 group-hover:invert',
          }"
          :collapsed="collapsed"
          :items="navItems"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UUser
          :avatar="{ alt: 'JeanCarlo' }"
          :name="collapsed ? '' : 'Jean Carlo'"
          :description="collapsed ? '' : 'correo@correo.com'"
        />
        <UButton
          :ui="{
            leadingIcon: 'size-6',
          }"
          variant="ghost"
          icon="jpkdz-logout"
          class="ml-auto size-10 cursor-pointer"
          size="md"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch />

    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

useHead({
  htmlAttrs: {
    'data-theme': 'dashboard',
  },
})

const navItems: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'jpkdz-admin-home',
  },
  {
    label: 'All Users',
    icon: 'jpkdz-admin-users',
  },
  {
    label: 'All Books',
    icon: 'jpkdz-admin-book',
  },
  {
    label: 'Borrow Requests',
    icon: 'jpkdz-admin-bookmark',
  },
  {
    label: 'Account Requests',
    icon: 'jpkdz-admin-user',
  },
]
</script>

<style scoped></style>
