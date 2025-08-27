<script setup lang="ts">
import { getPageData } from '~/services/api/get-page-data'

definePageMeta({ layout: 'default', key: r => r.fullPath })

const route = useRoute()

const { data, pending, error, refresh } = await useAsyncData(
  () => `page:${route.fullPath}`,
  () => getPageData(route.fullPath),
  { watch: [() => route.fullPath] }
)

useSeoMeta({
  title: () => data.value?.title ?? '',
  description: () => data.value?.short_description ?? ''
})
</script>

<template>
  <PageDataGate :sources="[{ data, pending, error, refresh }]">
    <PageBlockRenderer :page-blocks="data!.blocks" />
  </PageDataGate>
</template>
