<template>
  <div class="space-y-5">
    <AuthRegisterForm @submit="handleRegisterSubmit" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: {
    name: 'auth-layout',
    props: {
      title: 'Create Your Account',
      description:
        'Please complete all fields and upload a valid university ID to gain access to the library',
      footerText: 'Already have an account?',
      footerLinkTo: '/auth/login',
      footerLinkText: 'Sign In',
    },
  },
})

type RegisterFormPayload = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const toast = useToast()

const handleRegisterSubmit = async (payload: RegisterFormPayload) => {
  await Promise.resolve(payload)

  toast.add({
    title: 'Register event ready',
    description: `Captured submit for ${payload.email}`,
    color: 'success',
  })
}
</script>

<style scoped></style>
