<template>
  <UContainer>
    <div class="flex items-center gap-x-28 py-20 text-blue-100">
      <div class="flex-7/12">
        <h2 class="mb-5 text-5xl font-bold text-balance text-white">Origin</h2>

        <div class="mb-5 flex gap-5">
          <p>By <span class="text-primary font-bold">Dan Brown</span></p>
          <p>Category <span class="text-primary font-bold">Thriller / Suspense</span></p>
          <p><span class="text-primary font-bold">4.5</span>/5</p>
        </div>

        <div class="mb-5 flex gap-5">
          <p>Total Books : <span class="text-primary font-bold"> 100</span></p>
          <p>Available Books : <span class="text-primary font-bold"> 42</span></p>
        </div>

        <p class="max-w-[60ch] text-pretty">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam, odit. Iure, id
          pariatur tempore labore, doloribus totam vitae nobis nam non enim quam sint. Neque illum
          nulla temporibus minus minima?
        </p>

        <UButton
          class="font-bebas mt-9 uppercase"
          icon="jpkdz:book"
          size="xl"
        >
          Borrow Book Request
        </UButton>
      </div>

      <div class="relative flex-5/12">
        <BookCatalogBookImage class="relative z-10" />
        <BookCatalogBookImage class="absolute top-0 left-[35%] translate-y-12 rotate-10 blur" />
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts"></script>

<style scoped></style>
