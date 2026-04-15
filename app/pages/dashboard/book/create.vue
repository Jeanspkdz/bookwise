<template>
  <UDashboardPanel
    id="create-book"
    :ui="{
      body: 'bg-primary-50 overflow-visible',
      root: 'overflow-y-auto',
    }"
  >
    <template #header>
      <UDashboardNavbar
        toggle-side="right"
        class="bg-primary-50 border-0"
        :ui="{
          root: 'flex gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between',
          left: 'min-w-0 py-3',
          right: 'lg:w-auto',
        }"
      >
        <template #left>
          <div>
            <h2 class="text-xl font-semibold sm:text-2xl">Create New Book</h2>
            <p class="text-toned">Fill in the details to add a new book to your catalog</p>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div>
        <UButton
          label="Go Back"
          size="md"
          icon="i-lucide-arrow-left"
          @click="$router.back()"
        />
      </div>

      <BookCatalogFormCreate />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})

const value = ref()
watchEffect(() => {
  console.log(value.value)
})
</script>

<style scoped></style>
