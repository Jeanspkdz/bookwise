<template>
  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="footerColumns">
          <template #left>
            <div class="flex items-center gap-2 text-xl font-bold">
              <UIcon
                name="jpkdz-logo"
                class="size-8"
              />
              <h1 class="hidden md:block">BookWise</h1>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <div class="flex items-center gap-4">
        <p class="text-muted text-sm">Jeanspkdz © {{ new Date().getFullYear() }}</p>
      </div>
    </template>

    <template #right>
      <UButton
        icon="i-lucide-mail"
        aria-label="Contact Us"
        color="neutral"
        variant="ghost"
      />
      <UButton
        icon="i-lucide-book-open"
        aria-label="Documentation"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui'

const footerColumns: FooterColumn[] = [
  {
    label: 'Library',
    children: [
      {
        label: 'Browse Books',
        to: '#',
      },
      {
        label: 'My Borrowings',
        to: '#',
      },
      {
        label: 'New Arrivals',
        to: '#',
      },
    ],
  },
  {
    label: 'Support',
    children: [
      {
        label: 'Help Center',
        to: '#',
      },
      {
        label: 'How to Borrow',
        to: '#',
      },
      {
        label: 'Contact Us',
        to: '#',
      },
    ],
  },
  {
    label: 'Company',
    children: [
      {
        label: 'About BookWise',
        to: '#',
      },
      {
        label: 'Privacy Policy',
        to: '#',
      },
      {
        label: 'Terms of Service',
        to: '#',
      },
    ],
  },
]
</script>

<style scoped></style>
