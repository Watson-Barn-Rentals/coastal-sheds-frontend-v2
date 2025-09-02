<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import type { ImageMediaItem } from '~/types/image-media-item'

const props = defineProps<{
  imageMediaItem: ImageMediaItem
  objectPosition?: string
  dontUsePlaceholder?: boolean
  /** If true, make this image the LCP candidate (no lazy, fetchpriority=high). */
  eager?: boolean
  /** Optional fixed sizes string; if omitted we auto-measure (SSR-safe default 100vw). */
  sizes?: string
}>()

const objectPositionValue = computed(() => props.objectPosition ?? '50% 50%')

const imgRef = ref<HTMLImageElement | null>(null)

/**
 * Default to 100vw so SSR and non-JS bots get a sensible sizes value,
 * then refine on mount with actual element width.
 */
const dynamicSizes = ref('100vw')

const srcsetWithPlaceholder = computed(() => {
  const base = props.imageMediaItem.srcset
  if (props.dontUsePlaceholder || !props.imageMediaItem.placeholder) return base
  // Add a 1w candidate so browsers can pick a tiny LQIP quickly
  return `${base}, ${props.imageMediaItem.placeholder} 1w`
})

const resolvedSizes = computed(() => props.sizes ?? dynamicSizes.value)

function recomputeSizes() {
  // Refine sizes to the element's apparent width in vw (helps bandwidth)
  if (!imgRef.value) return
  const elementWidthPx = imgRef.value.getBoundingClientRect().width
  const viewportWidthPx = Math.max(1, window.innerWidth)
  const widthInVw = (elementWidthPx / viewportWidthPx) * 100
  dynamicSizes.value = `${widthInVw.toFixed(2)}vw`
}

let ro: ResizeObserver | null = null

onMounted(() => {
  // If the image already loaded (from SSR hydration), compute immediately
  if (imgRef.value?.complete) {
    recomputeSizes()
  }
  // Keep sizes fresh on resize/layout changes
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(recomputeSizes)
    if (imgRef.value) ro.observe(imgRef.value)
  }
})

onBeforeUnmount(() => {
  if (ro && imgRef.value) ro.unobserve(imgRef.value)
  window.removeEventListener('resize', recomputeSizes)
})

/** loading/fetchpriority tuned for LCP vs gallery images */
const loadingAttr = computed(() => (props.eager ? 'eager' : 'lazy'))
const fetchPriority = computed(() => (props.eager ? 'high' : 'auto'))

// If the browser swaps the currentSrc after load due to srcset, we might
// still want a size recompute (just in case). Keep your original watcher:
watch(() => imgRef.value?.complete, () => recomputeSizes(), { immediate: true })
</script>

<template>
  <picture class="relative w-full h-full object-cover">
    <!-- If you later add <source> elements (e.g., AVIF/WEBP), place them here -->
    <img
      ref="imgRef"
      :src="imageMediaItem.original_url"
      :srcset="srcsetWithPlaceholder"
      :sizes="resolvedSizes"
      :alt="imageMediaItem.alt"
      :width="imageMediaItem.width"
      :height="imageMediaItem.height"
      class="relative w-full h-full object-cover z-0"
      :style="{ objectPosition: objectPositionValue }"
      :loading="loadingAttr"
      :fetchpriority="fetchPriority"
      decoding="async"
    />
    <!-- No-JS fallback still benefits from the <img> above; this <noscript> is extra-safe -->
    <noscript>
      <img
        :src="imageMediaItem.original_url"
        :alt="imageMediaItem.alt"
        :width="imageMediaItem.width"
        :height="imageMediaItem.height"
        class="relative w-full h-full object-cover"
        :style="{ objectPosition: objectPositionValue }"
      />
    </noscript>
  </picture>
</template>
