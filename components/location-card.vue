<script setup lang="ts">
import type { ImageMediaItem } from '~/types/image-media-item'

defineProps<{
  heroImage: ImageMediaItem
  slug: string
  title: string
  address: string
  city: string
  state: string
  zip: string
  shortDescription: string
  estimatedDrivingTime?: string
  closestLocation?: boolean
}>()
</script>

<template>
  <AppLink
    :to="`/locations/${slug}`"
    class="group flex h-full flex-col overflow-hidden rounded-2xl bg-background-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-background-accent-dark"
  >
    <div v-if="estimatedDrivingTime" class="w-full bg-red-500">
      <p class="text-lg text-center text-white py-2">Approx. {{ estimatedDrivingTime }} away</p>
    </div>

    <div class="relative w-full">
      <!-- ⭐ Oblong starburst without border -->
      <div
        v-if="closestLocation"
        class="absolute top-2 left-2 z-[10] select-none pointer-events-none"
        role="img"
        aria-label="Closest location"
      >
        <svg
          viewBox="0 0 100 100"
          class="w-44 h-28 drop-shadow-lg"
          style="transform: rotate(-12deg)"
        >
          <g transform="translate(50 50) scale(1.55 0.9) translate(-50 -50)">
            <polygon
              fill="#ef4444"
              stroke="none"
              points="50.0,2.0 58.7,23.4 78.2,11.2 72.7,33.5 95.7,35.2 78.0,50.0 95.7,64.8 72.7,66.5 78.2,88.8 58.7,76.6 50.0,98.0 41.3,76.6 21.8,88.8 27.3,66.5 4.3,64.8 22.0,50.0 4.3,35.2 27.3,33.5 21.8,11.2 41.3,23.4"
            />
          </g>

          <text
            x="50"
            y="44"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="white"
            font-size="11"
            font-weight="800"
            style="letter-spacing:0.5px"
          >
            <tspan x="50" dy="0">CLOSEST</tspan>
            <tspan x="50" dy="14">LOCATION</tspan>
          </text>
        </svg>
      </div>

      <ResponsiveImage
        :image-media-item="heroImage"
        class="absolute inset-0 h-full w-full object-contain"
      />
    </div>

    <div class="flex min-h-0 flex-1 flex-col gap-2 px-4 py-4">
      <p class="text-lg font-bold">{{ title }}</p>
      <p class="text-lg">{{ city }}, {{ state }}</p>
      <p class="text-sm">{{ shortDescription }}</p>
      <div class="mt-auto"></div>
    </div>
  </AppLink>
</template>
