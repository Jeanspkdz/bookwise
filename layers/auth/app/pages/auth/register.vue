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

const toast = useToast()
const { register } = useAuth()

const handleRegisterSubmit: RegisterEventHandler = async (payload) => {
  const result = await register(payload)

  if (result.type === 'success') {
    toast.add({
      title: 'Registration submitted',
      description: 'Your account is pending admin approval. You can log in once approved.',
      color: 'warning',
    })

    return
  }

  toast.add({
    title: 'Registration failed',
    description: result.error,
    color: 'error',
  })
}
</script>

<style scoped></style>
