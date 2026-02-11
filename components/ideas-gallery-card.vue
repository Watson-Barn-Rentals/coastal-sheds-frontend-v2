<script setup lang="ts">
import type { ImageMediaItem } from '~/types/image-media-item'

defineProps<{
		image: ImageMediaItem
		title: string
		description: string | null
		designer_link: string | null
	}>()
</script>


<template>
    <div 
      class="group flex h-full flex-col overflow-hidden rounded-2xl bg-background-accent shadow-lg  dark:bg-background-accent-dark"
    >
        <!-- Fixed aspect box so the image is fully visible via object-contain -->
      <div class="relative w-full aspect-[16/9] bg-black/5">
        <ResponsiveImage
          :image-media-item="image"
          class="absolute inset-0 h-full w-full object-contain"
        />
      </div>
  
      <!-- Content fills the remaining height -->
      <div class="flex min-h-0 flex-1 flex-col gap-2 px-4 py-4">
        <p class="text-lg font-bold text-center">{{ title }}</p>
        <p v-if="description" class="text-sm">{{ description }}</p>
        <div class="mt-auto"></div>
        <a v-if="designer_link" :href="designer_link" class="flex justify-end text-hovered-link font-bold hover:right-2 cursor-pointer">
          <span class="my-auto leading-none">Customize in 3D</span>
          <UIcon name="si:arrow-right-fill"  class="w-6 h-6 my-auto"/>
        </a>
      </div>
    </div>
</template>
