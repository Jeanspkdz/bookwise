<template>
  <div>
    <AuthLoginForm @submit="handleLoginSubmit" />
    <BooKCover/>
  </div>
</template>

<script setup lang="ts">
import BooKCover from '#layers/book-catalog/app/components/book-cover.vue'

definePageMeta({
  layout: {
    name: 'auth-layout',
    props: {
      title: 'Welcome Back',
      description: 'Please sign in with your credentials to access your library account',

      footerText: "Don't have an account ?",
      footerLinkTo: '/auth/register',
      footerLinkText: 'Register',
    },
  },
})

type LoginFormPayload = {
  email: string
  password: string
}

const toast = useToast()

const handleLoginSubmit = async (payload: LoginFormPayload) => {
  await Promise.resolve(payload)

  toast.add({
    title: 'Login event ready',
    description: `Captured submit for ${payload.email}`,
    color: 'success',
  })
}
</script>

<style scoped></style>
