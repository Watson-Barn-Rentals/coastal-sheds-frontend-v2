<script setup lang="ts">
// import { submitTrackingEvent } from '~/services/submit-tracking-event' // (unused here)
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
import type { WatsonHomePageHeroBlockData } from '~/types/page-blocks/watson-home-page-hero'

const props = defineProps<{ data: WatsonHomePageHeroBlockData }>()

const slides = computed(() => props.data.slides ?? [])
const typeSpeed = computed(() => Math.max(10, props.data.titleLetterSpeedMilliseconds || 50)) // ms per letter
const delayAfterDeleteMs = 500

// --- slideshow / typing state ---
const currentIndex = ref(0)
const displayedTitle = ref('') // what’s rendered/typed
const isTyping = ref(true)
const isDeleting = ref(false)
const isWaiting = ref(false)

let timer: number | null = null
function clearTimer() {
  if (timer) {
    window.clearTimeout(timer)
    timer = null
  }
}
function nextIndex(i: number) {
  return (i + 1) % slides.value.length
}

// Text to type for current slide (title + "…")
const targetText = computed(() => {
  const t = slides.value[currentIndex.value]?.title || ''
  return `${t}...`
})

// Current image focal point
const objectPosition = computed(() => {
  const s = slides.value[currentIndex.value]
  return `${s?.centerPointX ?? 50}% ${s?.centerPointY ?? 50}%`
})

// Core loop: type → wait (slideDurationSeconds) → delete → (PAUSE) → switch slide + type next
function tick() {
  clearTimer()
  if (!slides.value.length) return

  const nowTarget = targetText.value

  if (isTyping.value) {
    const next = nowTarget.slice(0, displayedTitle.value.length + 1)
    displayedTitle.value = next

    if (next === nowTarget) {
      isTyping.value = false
      isWaiting.value = true
      const waitMs = Math.max(300, (slides.value[currentIndex.value]?.slideDurationSeconds || 3) * 1000)
      timer = window.setTimeout(() => {
        isWaiting.value = false
        isDeleting.value = true
        tick()
      }, waitMs)
      return
    }

    timer = window.setTimeout(tick, typeSpeed.value)
    return
  }

  if (isDeleting.value) {
    const next = displayedTitle.value.slice(0, -1)
    displayedTitle.value = next

    if (next.length === 0) {
      // finished deleting → PAUSE → switch slide → type next
      isDeleting.value = false
      timer = window.setTimeout(() => {
        currentIndex.value = nextIndex(currentIndex.value)
        isTyping.value = true
        tick()
      }, delayAfterDeleteMs)
      return
    }

    timer = window.setTimeout(tick, typeSpeed.value)
    return
  }

  // default start
  isTyping.value = true
  timer = window.setTimeout(tick, typeSpeed.value)
}

onMounted(() => {
  displayedTitle.value = ''
  isTyping.value = true
  isDeleting.value = false
  isWaiting.value = false
  tick()
})

onBeforeUnmount(() => {
  clearTimer()
})

// Reset gracefully if slides change
watch(slides, (arr) => {
  if (!arr?.length) return
  clearTimer()
  currentIndex.value = 0
  displayedTitle.value = ''
  isTyping.value = true
  isDeleting.value = false
  isWaiting.value = false
  tick()
})
</script>

<template>
  <section 
    :class="[
      'relative overflow-hidden',
      'h-[17rem] sm:h-[25rem] md:h-[32rem] lg:h-[35rem]' // Image height
    ]"
  >
    <div class="absolute inset-0 z-0">
      <div class="relative h-[60%] sm:h-[75%]">
        <div class="absolute inset-0 bg-[#c0150d]" style="clip-path: url(#gradiant2Clip);"></div>
        <div class="absolute inset-0 bg-[#1b4164]" style="clip-path: url(#gradiantClip);"></div>

        <!-- Image area -->
        <div class="absolute inset-0" style="clip-path: url(#heroClip);">
          <!-- Wrap the image in a layer div so both old/new stack and cross-fade without background flash -->
          <Transition name="fade">
            <div v-if="slides.length" :key="currentIndex" class="image-layer">
              <ResponsiveImage
                :imageMediaItem="slides[currentIndex].image"
                :object-position="objectPosition"
              />
            </div>
          </Transition>
        </div>

        <!-- Logo + Title area -->
        <div 
          :class="[
            'absolute w-full',
            'text-background dark:text-background-dark',
            'top-[7.5rem] sm:top-[15rem] md:top-[19rem] lg:top-[18rem]', // Logo top
            'h-[6rem] sm:h-[8rem] md:h-[10rem] lg:h-[17rem]'            // Logo height
          ]"
        >
          <!-- Roof background -->
          <svg 
            :class="[
              'absolute left-[2rem] top-0',
              'w-[14rem] sm:w-[20rem] md:w-[24rem] lg:w-[40rem]' // Roof bg width
            ]" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 2590 604"
          >
            <path d="M30,605L10,549,806,20,1846,300l722,253-14,51Z" fill="currentColor" />
          </svg>

          <!-- Roof logo -->
          <img
            src="/watson-hero-elements/watson-logo-red-roof-only.png"
            alt="Watson Logo Red Roof Only"
            :class="[
              'absolute left-[2rem] top-0 shrink-0',
              'w-[14rem] sm:w-[20rem] md:w-[24rem] lg:w-[40rem]' // Roof logo width
            ]"
          />

          <!-- Boxed W -->
          <img
            src="/watson-hero-elements/watson-logo-standard-boxed-w.png"
            alt="Watson Logo Standard Boxed W"
            :class="[
              'absolute bottom-0 shrink-0',
              'left-[3rem] sm:left-[4rem]',
              'w-[7rem] sm:w-[10rem] md:w-[12rem] lg:w-[20rem]' // Boxed W width
            ]"
          />

          <!-- 'atson' -->
          <span 
            :class="[
              'absolute leading-none font-[800] font-[TimesNewRoman] text-[#006595] shrink-0',
              'bottom-[0.25rem] sm:bottom-[0.5rem] lg:bottom-[1rem]',
              'left-[8rem] sm:left-[11.5rem] md:left-[13rem] lg:left-[18.5rem] xl:left-[19rem]', // atson pos
              'text-[3.25rem] md:text-[4rem] lg:text-[5.25rem] xl:text-[7rem]'                     // atson size
            ]"
          >atson</span>

          <!-- Typed title (desktop) -->
          <span 
            :class="[
              'hidden sm:block text-nowrap',
              'absolute leading-none font-[800] font-[TimesNewRoman] text-[#006595] shrink-0',
              'bottom-[0.25rem] sm:bottom-[0.5rem] lg:bottom-[1rem]',
              'left-[19.5rem] md:left-[23rem] lg:left-[31.5rem] xl:left-[37rem]', // title pos
              'text-[3rem] md:text-[4rem] lg:text-[5.25rem] xl:text-[7rem]',          // title size
              'typewriter-cursor'
            ]"
          >{{ displayedTitle }}</span>

          <!-- Typed title (mobile) -->
          <span 
            :class="[
              'block sm:hidden',
              'absolute leading-none font-[800] font-[TimesNewRoman] text-[#006595] shrink-0',
              '-bottom-[2.5rem]',
              'left-[8rem]',
              'text-[3rem]',
              'typewriter-cursor'
            ]"
          >{{ displayedTitle }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Clip paths -->
  <svg class="absolute w-0 h-0">
    <defs>
      <clipPath id="gradiant2Clip" clipPathUnits="objectBoundingBox">
        <path d="M-0.002 -0.002h1.004v0.95s-0.094 -0.091 -0.26 -0.08c-0.07 0.005 -0.13 0.046 -0.187 0.071 -0.094 0.04 -0.186 0.073 -0.267 0.056C0.085 0.95 -0.002 0.82 -0.002 0.82z" />
      </clipPath>
    </defs>
  </svg>
  <svg class="absolute w-0 h-0">
    <defs>
      <clipPath id="gradiantClip" clipPathUnits="objectBoundingBox">
        <path d="M-0.002 -0.002h1.004v0.95s-0.169 -0.133 -0.325 -0.078c-0.14 0.05 -0.229 0.086 -0.347 0.085C0.133 0.954 -0.002 0.759 -0.002 0.759z" />
      </clipPath>
    </defs>
  </svg>
  <svg class="absolute w-0 h-0">
    <defs>
      <clipPath id="heroClip" clipPathUnits="objectBoundingBox">
        <path d="M-0.002 0.651s0.121 0.202 0.304 0.236c0.044 0.008 0.127 0.011 0.202 0.002 0.088 -0.011 0.164 -0.061 0.254 -0.056 0.135 0.008 0.243 0.115 0.243 0.115V-0.002H-0.002z" />
      </clipPath>
    </defs>
  </svg>
</template>

<style scoped>
/* --- Cross-fade without showing background --- */
.image-layer {
  position: absolute;
  inset: 0;           /* stack layers perfectly */
}

/* Both entering and leaving layers stay stacked while opacity transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1000ms ease;
  position: absolute;
  inset: 0;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Blinking cursor for the typewriter text */
.typewriter-cursor::after {
  content: "";
  display: inline-block;
  width: 0.075em;
  height: 0.9em;
  margin-left: 0.1em;
  vertical-align: -0.05em;
  background: currentColor;
  animation: cursor-blink 1s steps(1) infinite;
}
@keyframes cursor-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Your existing effects */
.small-white-glow {
  filter: drop-shadow(0 0 2px white) drop-shadow(0 0 4px white);
}
.medium-black-glow {
  filter: drop-shadow(0 0 4px black) drop-shadow(0 0 8px black);
}
</style>
