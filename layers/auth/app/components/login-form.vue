<template>
  <UForm
    v-slot="{ loading }"
    :schema="schema"
    :state="state"
    class="space-y-5"
    @submit="handleSubmit"
  >
    <UFormField
      label="Email"
      name="email"
    >
      <UInput
        v-model="state.email"
        type="email"
        placeholder="eg: john@correo.com"
        size="lg"
        class="w-full rounded-sm"
        :ui="{
          base: 'text-white placeholder-gray-500  ring-accented/20 rounded-sm bg-[#1c1f2e] py-4 px-5',
        }"
      />
    </UFormField>

    <UFormField
      label="Password"
      name="password"
    >
      <AuthConfidentialInput
        v-model="state.password"
        placeholder="*********"
        size="lg"
        class="w-full"
        :ui="{
          base: 'text-white placeholder-gray-500  ring-accented/20 rounded-sm bg-[#1c1f2e] py-4 px-5',
        }"
      />
    </UFormField>

    <UButton
      type="submit"
      block
      :loading="loading"
      class="rounded-sm"
      size="xl"
      label="Login"
      :ui="{
        base: 'text-[#1a1500] font-bold rounded-lg justify-center mt-2',
      }"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const props = defineProps<{
  onSubmit: (payload: LoginSchema) => Promise<void>
}>()

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

type LoginSchema = z.output<typeof schema>

const state = reactive<Partial<LoginSchema>>({
  email: '',
  password: '',
})

const resetForm = () => {
  state.email = ''
  state.password = ''
}

const handleSubmit = async (event: FormSubmitEvent<LoginSchema>) => {
  await props.onSubmit(event.data)
  resetForm()
}
</script>

<style scoped></style>
