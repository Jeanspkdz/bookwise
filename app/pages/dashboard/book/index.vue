<template>
  <UDashboardPanel
    id="home"
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
          root: 'flex gap-4 px-4  sm:px-6 lg:flex-row lg:items-center lg:justify-between',
          left: 'min-w-0 py-3',
          right: 'lg:w-auto',
        }"
      >
        <template #left>
          <div>
            <h2 class="text-xl font-semibold sm:text-2xl">Welcome,<span> Jeans</span></h2>
            <p class="text-toned">Monitor all of your projects and tasks here</p>
          </div>
        </template>
        <template #right>
          <UDashboardSearchButton
            class="hidden justify-start md:flex md:w-full lg:w-[450px]"
            label="Search users, books by title, author, or genre."
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="rounded-xl bg-white p-4 sm:p-5">
        <div
          class="mb-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:text-center"
        >
          <h3 class="text-xl font-semibold">All Books</h3>
          <UButton
            color="primary"
            size="md"
            to="/dashboard/book/create"
            label="Create a new Book"
            icon="jpkdz-admin-plus"
            class="w-full justify-center px-2.5 py-3 sm:w-auto"
            :ui="{
              leadingIcon: 'invert brightness-0 size-3',
            }"
          />
        </div>

        <div class="max-w-full overflow-x-auto">
          <BookCatalogTable
            :books="books"
            :pending="pending"
            :error="error"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
})

const { books, pending, error } = useBooks()
</script>
