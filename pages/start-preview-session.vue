<script setup lang="ts">
import { useRoute, useRouter, useCookie, onMounted } from '#imports'

const route = useRoute()
const router = useRouter()
// Create a cookie named "previewToken" scoped to the entire site
const previewCookie = useCookie('previewToken', { path: '/' })

onMounted(() => {
  const token = route.query.token as string | undefined

  if (token) {
    // Set the cookie (expires when browser closes; adjust options if you like)
    previewCookie.value = token
  }

  reloadNuxtApp()

  // Redirect to home
  navigateTo('/')

})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-gray-600">Starting preview session…</p>
  </div>
</template>
