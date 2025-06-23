<script setup lang="ts">
import { getPageData } from '~/services/api/get-page-data'
import type { PageData } from '~/types/page-data'
import { useRoute, useCookie, useRequestEvent } from '#imports'

// 1) Always enable SSR on this page so Nuxt will serve
//    static files when available, or SSR when not.
definePageMeta({
  layout: 'default',
  ssr: true,
})

const route = useRoute()

// 2) Figure out previewToken both server- and client-side
const previewToken = import.meta.server
  ? (useRequestEvent()?.context.previewToken as string | null)
  : useCookie('previewToken', { path: '/' }).value ?? null

// 3) Build a unique data key:
//    - no token  => "pageData-/about-us"
//    - with token => "pageData-/about-us-preview"
const dataKey = `pageData-${route.fullPath}` + (previewToken ? '-preview' : '')

// 4) Fetch or reuse the payload:
//    - On SSG build (no cookie) Nitro sees key without "-preview" and
//      serves the prerendered JSON.
//    - On preview (cookie present) key includes "-preview", so Nitro
//      cannot find prerendered JSON and will do SSR.
const { data, refresh } = await useAsyncData<PageData>(
  () => dataKey,
  () => getPageData(route.fullPath, previewToken),
)

// 5) When navigating client-side, re-run the fetch
watch(() => route.fullPath, () => {
  refresh()
})
</script>

<template>
  <PageBlockRenderer
    v-if="data"
    :page-blocks="data.blocks"
  />
</template>

