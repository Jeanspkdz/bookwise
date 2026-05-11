<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-5"
    @submit="onSubmit"
  >
    <UFormField
      label="Full name"
      name="fullName"
    >
      <UInput
        v-model="state.fullName"
        placeholder="eg: John Doe"
        size="lg"
        class="w-full"
        :ui="{
          base: 'text-white ring-accented/20 ',
        }"
      />
    </UFormField>

    <UFormField
      label="Email"
      name="email"
    >
      <UInput
        v-model="state.email"
        type="email"
        placeholder="eg: john@correo.com"
        size="lg"
        class="w-full"
        :ui="{
          base: 'text-white placeholder-gray-500  ring-accented/20',
        }"
      />
    </UFormField>

    <UFormField
      label="Password"
      name="password"
    >
      <AuthConfidentialInput
        v-model="state.password"
        placeholder="At least 8 characters long"
        size="lg"
        class="w-full"
        :ui="{
          base: ' text-white placeholder-gray-500  ring-accented/20',
        }"
      />
    </UFormField>

    <UFormField
      label="Confirm password"
      name="confirmPassword"
    >
      <AuthConfidentialInput
        v-model="state.confirmPassword"
        placeholder="Repeat your password"
        size="lg"
        class="w-full"
        :ui="{
          base: ' text-white placeholder-gray-500  ring-accented/20',
        }"
      />
    </UFormField>

    <UButton
      type="submit"
      block
      class="rounded-sm"
      size="xl"
      label="Sign Up"
      :ui="{
        base: 'text-[#1a1500] font-bold rounded-lg justify-center mt-2',
      }"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const schema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Confirm password is required')
      .min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
    when(payload) {
      return payload.issues.every((iss) => {
        const firstPathEl = iss.path?.[0]
        return firstPathEl !== 'password' && firstPathEl !== 'confirmPassword'
      })
    },
  })

type RegisterSchema = z.output<typeof schema>

const emit = defineEmits<{
  submit: [payload: RegisterSchema]
}>()

const state = reactive<Partial<RegisterSchema>>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const onSubmit = (event: FormSubmitEvent<RegisterSchema>) => {
  emit('submit', event.data)
}
</script>

<style scoped></style>
