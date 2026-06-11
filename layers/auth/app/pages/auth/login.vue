<template>
  <div>
    <AuthLoginForm @submit="handleLoginSubmit" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~~/layers/shared/app/stores/useUserStore'

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

const toast = useToast()
const { login } = useAuth()
const userStore = useUserStore()

const handleLoginSubmit: LoginEventHandler = async (payload) => {
  const result = await login(payload)

  if (result.type === 'success') {
    await userStore.getUser()

    toast.add({
      title: 'Login successful',
      description: `Welcome back ${result.data.name}`,
      color: 'success',
    })

    await navigateTo('/')
    return
  }
  toast.add({
    title: 'Login failed',
    description: result.error,
    color: 'error',
  })
}
</script>

<style scoped></style>
