<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useHead } from '#imports'
import { twMerge } from 'tailwind-merge'
import type { ImageMediaItem } from '~/types/image-media-item'

const props = defineProps<{
  images: ImageMediaItem[]
  initialIndex?: number
  loop?: boolean
  showThumbnails?: boolean
  enableKeyboard?: boolean
  imageClasses?: string
  /** Preload & prioritize the first (LCP) image in the carousel */
  preloadFirstImage?: boolean
  /** Optional ribbon text (top-right), like the inventory card */
  ribbonText?: string | null
  ribbonColor?: string | null
  ribbonTextColor?: string | null
}>()

const emit = defineEmits<{ (e: 'change', index: number): void }>()

const loop = computed(() => props.loop ?? true)
const showThumbnails = computed(() => props.showThumbnails ?? true)
const enableKeyboard = computed(() => props.enableKeyboard ?? true)

const count = computed(() => props.images?.length ?? 0)
const hasImages = computed(() => count.value > 0)
const isSingle = computed(() => count.value <= 1)
const lastIndex = computed(() => Math.max(0, count.value - 1))
const current = ref(Math.min(props.initialIndex ?? 0, lastIndex.value))

watch(
  () => props.initialIndex,
  (val) => {
    if (typeof val === 'number') {
      current.value = Math.min(Math.max(0, val), lastIndex.value)
    }
  }
)

/** Preload LCP candidate (first image) for SEO/Performance if opted-in */
const shouldPreload = computed(() => (props.preloadFirstImage ?? true) && hasImages.value)
useHead(() => {
  if (!shouldPreload.value) return {}
  const first = props.images[0]
  return {
    link: [
      {
        rel: 'preload',
        as: 'image',
        href: first.original_url,
        imagesrcset: first.srcset,
        imagesizes: '100vw',
        fetchpriority: 'high',
      },
    ],
  }
})

function goTo(index: number) {
  if (!hasImages.value || isSingle.value) return
  const clamped = Math.min(Math.max(0, index), lastIndex.value)
  current.value = clamped
  emit('change', clamped)
}

function next() {
  if (!hasImages.value || isSingle.value) return
  if (current.value < lastIndex.value) return goTo(current.value + 1)
  if (loop.value) return goTo(0)
}

function prev() {
  if (!hasImages.value || isSingle.value) return
  if (current.value > 0) return goTo(current.value - 1)
  if (loop.value) return goTo(lastIndex.value)
}

// keyboard navigation (opt-in)
function onKeydown(e: KeyboardEvent) {
  if (!enableKeyboard.value || isSingle.value) return
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  }
}

onMounted(() => {
  if (enableKeyboard.value) {
    window.addEventListener('keydown', onKeydown)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

// swipe support
let touchStartX = 0
let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  if (isSingle.value) return
  const t = e.touches[0]
  touchStartX = t.clientX
  touchStartY = t.clientY
}
function onTouchEnd(e: TouchEvent) {
  if (isSingle.value) return
  const t = e.changedTouches[0]
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) next()
    else prev()
  }
}
</script>

<template>
  <div
    v-if="hasImages"
    class="relative w-full overflow-hidden"
    role="region"
    aria-roledescription="carousel"
    aria-label="Image gallery"
    aria-live="polite"
  >
    <!-- Top-right ribbon (optional) -->
      <div
        v-if="ribbonText"
        class="pointer-events-none absolute top-0 left-0 z-[10] w-56 h-56 select-none"
        aria-live="polite"
        :aria-label="ribbonText"
      >
        <!-- The wide band rotated 45°, centered text, supports long labels -->
        <div
          class="absolute top-7 -left-14 w-full -rotate-45 shadow-lg flex items-center justify-center py-2 px-12"
          :style="{
            backgroundColor: ribbonColor ?? 'white',
            color: ribbonTextColor ?? 'black',
          }"
        >
          <span class="text-md font-extrabold tracking-wide leading-tight text-center whitespace-normal break-keep line-clamp-2">
            {{ ribbonText }}
          </span>
        </div>
      </div>

    <!-- Main frame -->
    <div
      :class="twMerge('relative w-full overflow-hidden', imageClasses)"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <!-- Use a simple translateX slider -->
      <div
        class="flex transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <div
          v-for="(img, i) in images"
          :key="img.original_url + '-' + i"
          class="relative min-w-full bg-neutral-100 dark:bg-neutral-800"
          :aria-hidden="i !== current"
        >
          <!-- Eager-load only the current image to improve LCP; others are lazy -->
          <ResponsiveImage
            :image-media-item="img"
            :eager="i === current && i === 0"
            class="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      <!-- Prev / Next controls -->
      <button
        type="button"
        :disabled="isSingle"
        :aria-disabled="isSingle ? 'true' : 'false'"
        :class="twMerge(
          'rounded-l-2xl p-2 pr-10 absolute left-0 top-0 w-20 h-full text-white bg-transparent focus:outline-none cursor-pointer text-[4rem] transition-all duration-200',
          isSingle
            ? 'opacity-20 cursor-not-allowed pointer-events-none'
            : 'opacity-40 hover:opacity-100 hover:bg-linear-to-r hover:from-black hover:via-black/50 hover:to-transparent'
        )"
        aria-label="Previous image"
        @click="prev"
      >
        ‹
      </button>
      <button
        type="button"
        :disabled="isSingle"
        :aria-disabled="isSingle ? 'true' : 'false'"
        :class="twMerge(
          'rounded-r-2xl p-2 pl-12 absolute right-0 top-0 w-20 h-full text-white bg-transparent focus:outline-none cursor-pointer text-[4rem] transition-all duration-200',
          isSingle
            ? 'opacity-20 cursor-not-allowed pointer-events-none'
            : 'opacity-40 hover:opacity-100 hover:bg-linear-to-l hover:from-black hover:via-black/50 hover:to-transparent'
        )"
        aria-label="Next image"
        @click="next"
      >
        ›
      </button>

      <!-- Dot indicators -->
      <div
        class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/30 rounded-full px-2 py-1"
        role="tablist"
        aria-label="Slide indicators"
      >
        <button
          v-for="(img, i) in images"
          :key="'dot-' + img.original_url + '-' + i"
          type="button"
          class="w-2.5 h-2.5 rounded-full"
          :class="i === current ? 'bg-white' : 'bg-white/50 hover:bg-white/80'"
          :aria-label="`Go to slide ${i + 1}`"
          :aria-selected="i === current"
          role="tab"
          @click="goTo(i)"
          :disabled="isSingle"
          :aria-disabled="isSingle ? 'true' : 'false'"
        />
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="showThumbnails" class="mt-3 flex gap-4 overflow-x-auto p-1 justify-center">
      <button
        v-for="(img, i) in images"
        :key="'thumb-' + img.original_url + '-' + i"
        type="button"
        class="relative shrink-0 w-20 h-16 rounded-lg overflow-hidden ring-4"
        :class="i === current ? 'ring-blue-500' : 'ring-transparent hover:ring-blue-300'"
        @click="goTo(i)"
        :aria-label="`Select image ${i + 1}`"
        :disabled="isSingle"
        :aria-disabled="isSingle ? 'true' : 'false'"
      >
        <ResponsiveImage
          :image-media-item="img"
          dont-use-placeholder
          class="w-full h-full"
        />
      </button>
    </div>

    <!-- No-JS fallback for bots/link unfurlers -->
    <noscript>
      <ul>
        <li v-for="(img, i) in images" :key="'ns-' + img.original_url + '-' + i">
          <img
            :src="img.original_url"
            :alt="img.alt"
            :width="img.width"
            :height="img.height"
            style="object-fit: cover; width: 100%; height: auto"
          />
        </li>
      </ul>
    </noscript>
  </div>

  <!-- Fallback when no images -->
  <div v-else class="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
</template>

<style scoped>
button:focus:not(:focus-visible) { outline: none; }
</style>
