<script setup lang="ts">
import { formatPrice, formatRoundedPrice } from '~/services/format-price'
import { getGoogleMapsLinkForAddress } from '~/services/get-google-maps-link-for-address';
import type { ImageMediaItem } from '~/types/image-media-item'

const props = defineProps<{
  heroImage: ImageMediaItem
  serialNumber: string
  size: string | null
  productLineTitle: string
  productLineDiscontinued: boolean
  productTitle: string
  productDiscontinued: boolean
  cashPrice: number
  discountAmount: number | null
  locationName: string
  lotNumber: string | null
  highlightedLabel: string | null
  usedBuilding: boolean
  approxDriveTimeText?: string | null
  locationAddress: string
  locationCity: string
  locationState: string
  locationZip: string
}>()

/**
 * Prefer highlightedLabel; otherwise show a discount ribbon ("$X Off!")
 * Ribbon hides entirely if neither is present.
 */
const ribbonText = computed(() => {
  if (props.highlightedLabel) return props.highlightedLabel
  if (props.discountAmount) return `${formatRoundedPrice(props.discountAmount)} Off!`
  return ''
})
</script>

<template>
  <NuxtLink
    external
    :to="`/inventory/${serialNumber}/`"
    class="group flex h-full flex-col overflow-hidden rounded-2xl bg-background-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-background-accent-dark"
  >
    <div v-if="approxDriveTimeText" class="w-full bg-background-accent dark:bg-background-accent-dark z-[20] flex flex-col gap-2 py-2">
      <p class="text-lg text-center">Approx. {{ approxDriveTimeText }} away</p>
      <NuxtLink 
        external
        target="_blank"
        :to="getGoogleMapsLinkForAddress(locationAddress, locationCity, locationState, locationZip)"
        class="text-hovered-link underline text-center text-sm mx-auto"
      >
        {{ locationAddress }}, {{ locationCity }}, {{ locationState }}, {{ locationZip }}
      </NuxtLink>
    </div>
    <div class="relative w-full">
      <!-- 45° Ribbon (top-left) -->
      <div
        v-if="ribbonText"
        class="pointer-events-none absolute top-0 left-0 z-[10] w-56 h-56 select-none"
        aria-live="polite"
        :aria-label="ribbonText"
      >
        <!-- The wide band rotated 45°, centered text, supports long labels -->
        <div
          class="absolute top-7 -left-14 w-full -rotate-45 shadow-lg flex items-center justify-center py-2 px-12"
          :class="{
            'bg-red-600 text-white': discountAmount && !highlightedLabel,
            'bg-yellow-500 text-black': highlightedLabel
          }"
        >
          <span class="text-md font-extrabold tracking-wide leading-tight text-center whitespace-normal break-keep line-clamp-2">
            {{ ribbonText }}
          </span>
        </div>

        <!-- <div
          class="absolute top-6 -left-12 sm:-left-16 w-[200%] origin-left -rotate-45
                 bg-red-500 text-white shadow-lg
                 px-6 py-2
                 flex items-center justify-center
                 text-xs sm:text-sm font-extrabold tracking-wide
                 leading-tight text-center break-words line-clamp-2"
        >
          {{ ribbonText }}
        </div> -->
      </div>

      <ResponsiveImage
        :image-media-item="heroImage"
        class="absolute inset-0 h-full w-full object-contain"
      />
    </div>

    <div class="flex min-h-0 flex-1 flex-col gap-2 px-4 py-4">
      <p class="text-lg font-bold text-center">{{ size ? size + ' ' : '' }}{{ productTitle }}</p>

      <div class="flex gap-2 text-sm">
        <span class="font-bold shrink-0">Product Line:</span>
        <span>{{ productLineTitle }} <span v-if="productLineDiscontinued">(Discontinued Line)</span></span>
      </div>

      <div class="flex gap-2 text-sm">
        <span class="font-bold shrink-0">New/Used:</span>
        <span>{{ usedBuilding ? 'Used' : 'New' }}</span>
      </div>

      <div class="flex gap-2 text-sm">
        <span class="font-bold shrink-0">Serial #:</span>
        <span>{{ serialNumber }}</span>
      </div>

      <div class="flex gap-2 text-sm">
        <span class="font-bold shrink-0">Price:</span>
        <span :class="{ 'line-through': discountAmount }">{{ formatPrice(cashPrice) }}</span>
        <span v-if="discountAmount" class="ml-2 text-red-500">{{ formatPrice(cashPrice - discountAmount) }}</span>
      </div>

      <div class="flex gap-2 text-sm">
        <span class="font-bold shrink-0">Location:</span>
        <span>{{ locationName }} ({{ locationCity }}, {{ locationState }})</span>
      </div>

      <div class="mt-auto"></div>
    </div>
  </NuxtLink>
</template>
