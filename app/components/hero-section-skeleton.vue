<template>
  <div class="flex w-full items-center gap-x-28">
    <div class="flex-7/12 space-y-5">
      <USkeleton class="h-14 w-3/4" />

      <div class="flex gap-5">
        <USkeleton class="h-5 w-32" />
        <USkeleton class="h-5 w-28" />
        <USkeleton class="h-5 w-20" />
      </div>

      <div class="flex gap-5">
        <USkeleton class="h-5 w-28" />
        <USkeleton class="h-5 w-36" />
      </div>

      <div class="max-w-[60ch] space-y-3">
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-[92%]" />
        <USkeleton class="h-4 w-2/3" />
      </div>

      <USkeleton class="mt-9 h-12 w-48 rounded-md" />
    </div>

    <div class="relative flex-5/12">
      <USkeleton class="relative z-10 h-[385px] w-[277px] rounded-xl" />
      <USkeleton
        class="absolute! top-0 left-[35%] h-[385px] w-[277px] translate-y-9 rotate-10 rounded-xl blur"
      />
    </div>
  </div>
</template>
