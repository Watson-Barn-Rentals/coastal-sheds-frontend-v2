<script setup lang="ts">
import type { ImageMediaItem } from '~/types/image-media-item'

defineProps<{
  heroImage: ImageMediaItem
  title: string
  description: string
  link: string
}>()
</script>

<template>
  <NuxtLink
    :to="link"
    class="group flex h-full flex-col overflow-hidden rounded-2xl bg-background-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-background-accent-dark"
  >
    <!-- Fixed aspect box so the image is fully visible via object-contain -->
    <div class="relative w-full aspect-[16/9] bg-black/5">
      <ResponsiveImage
        :image-media-item="heroImage"
        class="absolute inset-0 h-full w-full object-contain"
      />
    </div>

    <!-- Content fills the remaining height -->
    <div class="flex min-h-0 flex-1 flex-col gap-2 px-4 py-4">
      <p class="text-lg font-bold">{{ title }}</p>
      <p class="text-sm">{{ description }}</p>
      <!-- spacer to push any future CTA to the bottom if needed -->
      <div class="mt-auto"></div>
    </div>
  </NuxtLink>
</template>
