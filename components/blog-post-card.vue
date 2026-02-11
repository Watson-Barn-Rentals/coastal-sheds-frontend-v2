<script setup lang="ts">
import type { ImageMediaItem } from '~/types/image-media-item'

defineProps<{
  heroImage: ImageMediaItem | null
  slug: string
  title: string
  description: string
  datePublished: Date
  // TODO - Add author
}>()
</script>

<template>
  <NuxtLink
    external
    :to="`/blog/${slug}`"
    class="group flex h-full flex-col overflow-hidden rounded-2xl bg-background-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-background-accent-dark"
  >
    <!-- Forced 5:1 aspect -->
    <div v-if="heroImage" class="relative w-full overflow-hidden [aspect-ratio:5/1]">
      <div class="absolute inset-0 size-full object-contain">
        <ResponsiveImage
          :image-media-item="heroImage"
        />
      </div>
    </div>

    <div class="flex min-h-0 flex-1 flex-col gap-2 px-4 py-4">
      <p class="text-xl font-bold text-center">{{ title }}</p>
      <p class="text-sm text-center">{{ datePublished.toLocaleDateString() }}</p>
      <p class="text-sm">{{ description }}</p>
      <div class="mt-auto"></div>
    </div>
  </NuxtLink>
</template>

