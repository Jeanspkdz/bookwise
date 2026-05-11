<template>
  <div class="rounded-xl bg-white p-5">
    <div class="grid gap-6 lg:grid-cols-[160px_1fr]">
      <USkeleton class="h-56 w-40 rounded-lg" />
      <div class="space-y-3">
        <USkeleton class="h-5 w-36" />
        <USkeleton class="h-8 w-3/4" />
        <USkeleton class="h-6 w-1/2" />
        <USkeleton class="h-4 w-1/3" />
        <USkeleton class="h-10 w-40" />
      </div>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div class="space-y-3">
        <USkeleton class="h-6 w-32" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-[90%]" />
      </div>
      <div class="space-y-3">
        <USkeleton class="h-6 w-24" />
        <USkeleton class="h-48 w-full rounded-lg" />
      </div>
    </div>
  </div>
</template>
