<script setup lang="ts">
import type { ImageMediaItem } from '~/types/image-media-item'

withDefaults(
	defineProps<{
		heroImage: ImageMediaItem
		title: string
		description: string
		link: string
		startingPrice?: string
		designerLink?: string
		showStartingPrice?: boolean
		show3dDesignLink?: boolean
		clickable?: boolean
	}>(),
	{
		clickable: true,
	}
)
</script>


<template>
    <div 
      v-if="!clickable"
      class="group flex h-full flex-col overflow-hidden rounded-2xl bg-background-accent shadow-lg  dark:bg-background-accent-dark"
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
        <p class="text-md text-center italic" v-if="(showStartingPrice ?? false) && startingPrice">Starting at ${{ startingPrice }}</p>
        <a :href="designerLink" class="flex justify-end text-hovered-link font-bold hover:right-2 cursor-pointer" v-if="(show3dDesignLink ?? false) && designerLink">
          <span class="my-auto leading-none">Design in 3D</span>
          <UIcon name="si:arrow-right-fill"  class="w-6 h-6 my-auto"/>
        </a>
        <!-- spacer to push any future CTA to the bottom if needed -->
        <div class="mt-auto"></div>
      </div>
    </div>
  <a
    v-else
    :href="link"
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
      <p class="text-md text-center italic" v-if="(showStartingPrice ?? false) && startingPrice">Starting at ${{ startingPrice }}</p>
      <div class="flex justify-end text-hovered-link font-bold hover:right-2" v-if="(show3dDesignLink ?? false) && designerLink">
        <span class="my-auto leading-none">Design in 3D</span>
        <UIcon name="si:arrow-right-fill"  class="w-6 h-6 my-auto"/>
      </div>
      <!-- spacer to push any future CTA to the bottom if needed -->
      <div class="mt-auto"></div>
    </div>
  </a>
</template>
