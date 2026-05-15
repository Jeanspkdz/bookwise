<template>
  <UForm
    v-slot="{ loading }"
    :schema="schema"
    :state="state"
    class="space-y-5"
    @submit="handleSubmit"
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
      label="Student code"
      name="studentCode"
    >
      <UInput
        v-model="state.studentCode"
        type="text"
        placeholder="eg: 12345678"
        size="lg"
        class="w-full"
        :ui="{
          base: 'text-white placeholder-gray-500 ring-accented/20',
        }"
      />
    </UFormField>

    <UFormField
      label="Phone number"
      name="phoneNumber"
    >
      <UInput
        v-model="state.phoneNumber"
        type="tel"
        placeholder="eg: +1 555-123-4567"
        size="lg"
        class="w-full"
        :ui="{
          base: 'text-white placeholder-gray-500 ring-accented/20',
        }"
      />
    </UFormField>

    <UFormField
      label="Address"
      name="address"
    >
      <UInput
        v-model="state.address"
        placeholder="eg: 123 Main St, City"
        size="lg"
        class="w-full"
        :ui="{
          base: 'text-white placeholder-gray-500 ring-accented/20',
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
      :loading="loading"
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
    studentCode: z
      .string()
      .min(1, 'Student code is required')
      .regex(/^\d{8}$/, 'Student code must be exactly 8 digits'),
    phoneNumber: z
      .stringFormat('phone-number', /^\+?[0-9][0-9()\s-]{6,19}$/, {
        error: 'Invalid phone number format',
      })
      .min(1, 'Phone number is required'),
    address: z
      .string()
      .min(1, 'Address is required')
      .min(5, 'Address must be at least 5 characters'),
    email: z.email('Invalid email address'),
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

const props = defineProps<{
  onSubmit: (payload: RegisterSchema) => Promise<void>
}>()

const state = reactive<Partial<RegisterSchema>>({
  fullName: '',
  studentCode: '',
  phoneNumber: '',
  address: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const resetForm = () => {
  state.fullName = ''
  state.studentCode = ''
  state.phoneNumber = ''
  state.address = ''
  state.email = ''
  state.password = ''
  state.confirmPassword = ''
}

const handleSubmit = async (event: FormSubmitEvent<RegisterSchema>) => {
  await props.onSubmit(event.data)
  resetForm()
}
</script>

<style scoped></style>
