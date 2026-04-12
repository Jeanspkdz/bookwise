<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar toggle-side="right">
        <template #left>
          <div class="flex flex-col">
            <h2 class="text-2xl font-semibold">Welcome,<span> Jeans</span></h2>
            <p class="text-toned">Monitor all of your projects and tasks here</p>
          </div>
        </template>
        <template #right>
          <UDashboardSearchButton
            class="min-w-[450px]"
            label="Search users, books by title, author, or genre."
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body> Hello </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
  layout: 'admin-layout',
})
</script>

<style scoped>
body {
  background-color: white;
}
</style>
