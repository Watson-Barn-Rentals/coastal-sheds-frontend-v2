<script setup lang="ts">
import { useRoute, useCookie, onMounted } from '#imports'
import { navigateTo, reloadNuxtApp, useRuntimeConfig } from '#app'

const route = useRoute()
const previewCookie = useCookie('previewToken', { path: '/' })

const config = useRuntimeConfig()

onMounted(() => {
  const token = route.query.token as string | undefined

  // only in preview build
  if (token && config.public.previewMode === true) {
    console.log('Starting preview session with token:', token)
    console.log('Preview mode is enabled:', config.public.previewMode)
    previewCookie.value = token
    // force Nuxt to re-init so your SSR middleware sees the new cookie
    reloadNuxtApp()

    navigateTo('/')
  } else {
    navigateTo('/error')
  }

})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-gray-600">Starting preview session…</p>
  </div>
</template>
