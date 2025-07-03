<script setup lang="ts">
import { getPageData } from '~/services/api/get-page-data'
import type { PageData } from '~/types/page-data'
import { useRoute, useCookie, useRequestEvent } from '#imports'

// 1) Always enable SSR on this page so Nuxt will serve
//    static files when available, or SSR when not.

const route = useRoute()

const dataKey = `pageData-${route.fullPath}`

const { data, refresh } = await useAsyncData<PageData>(
  () => dataKey,
  () => getPageData(route.fullPath),
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

