<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import type { ImageMediaItem } from '~/types/image-media-item';


const props = defineProps<{
  images: ImageMediaItem[]
  initialIndex?: number
  loop?: boolean
  showThumbnails?: boolean
  enableKeyboard?: boolean
  imageClasses?: string
}>()

const emit = defineEmits<{
  (e: 'change', index: number): void
}>()

const loop = computed(() => props.loop ?? true)
const showThumbnails = computed(() => props.showThumbnails ?? true)
const enableKeyboard = computed(() => props.enableKeyboard ?? true)

const hasImages = computed(() => (props.images?.length ?? 0) > 0)
const lastIndex = computed(() => Math.max(0, (props.images?.length ?? 1) - 1))

const current = ref(Math.min(props.initialIndex ?? 0, lastIndex.value))

watch(
  () => props.initialIndex,
  (val) => {
    if (typeof val === 'number') {
      current.value = Math.min(Math.max(0, val), lastIndex.value)
    }
  }
)

function goTo(index: number) {
  if (!hasImages.value) return
  const clamped = Math.min(Math.max(0, index), lastIndex.value)
  current.value = clamped
  emit('change', clamped)
}

function next() {
  if (!hasImages.value) return
  if (current.value < lastIndex.value) return goTo(current.value + 1)
  if (loop.value) return goTo(0)
}

function prev() {
  if (!hasImages.value) return
  if (current.value > 0) return goTo(current.value - 1)
  if (loop.value) return goTo(lastIndex.value)
}

// keyboard navigation (opt-in)
function onKeydown(e: KeyboardEvent) {
  if (!enableKeyboard.value) return
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
  const t = e.touches[0]
  touchStartX = t.clientX
  touchStartY = t.clientY
}
function onTouchEnd(e: TouchEvent) {
  const t = e.changedTouches[0]
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  // require mostly horizontal gesture with a minimum distance
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) next()
    else prev()
  }
}
</script>

<template>
  <div
    v-if="hasImages"
    class="relative w-full"
    role="region"
    aria-roledescription="carousel"
    aria-label="Image gallery"
  >
    <!-- Main frame -->
    <div
      :class="twMerge('relative w-full overflow-hidden', imageClasses)"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <!-- Use a simple translateX slider for instant render; could be transitioned if desired -->
      <div
        class="flex transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <div
          v-for="(img, i) in images"
          :key="img.original_url + '-' + i"
          class="relative min-w-full bg-neutral-100 dark:bg-neutral-800"
        >
          <!-- Your existing responsive image component -->
          <ResponsiveImage
            :image-media-item="img"
            class="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      <!-- Prev / Next controls -->
      <button
        type="button"
        class="rounded-l-2xl pr-10 absolute left-0 top-0 w-20 h-full text-white p-2 hover:bg-linear-to-r hover:from-black hover:via-black/50 hover:to-transparent bg-transparent focus:outline-none cursor-pointer text-[4rem] opacity-40 hover:opacity-100 transition-all duration-200"
        aria-label="Previous image"
        @click="prev"
      >
        ‹
      </button>
      <button
        type="button"
        class="rounded-r-2xl pl-10 absolute right-0 top-0 w-20 h-full text-white p-2 hover:bg-linear-to-l hover:from-black hover:via-black/50 hover:to-transparent bg-transparent focus:outline-none cursor-pointer text-[4rem] opacity-40 hover:opacity-100 transition-all duration-200"
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
      >
        <!-- Tiny thumb: we can reuse the same component; it will pick the right candidate via sizes/srcset -->
        <ResponsiveImage
          :image-media-item="img"
          dont-use-placeholder
          class="w-full h-full"
        />
      </button>
    </div>
  </div>

  <!-- Fallback when no images -->
  <div v-else class="w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
</template>

<style scoped>
/* Optional: hide focus outline for mouse users but keep it for keyboard */
button:focus:not(:focus-visible) { outline: none; }
</style>
