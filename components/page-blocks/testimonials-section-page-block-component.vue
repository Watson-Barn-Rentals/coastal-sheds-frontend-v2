<script setup lang="ts">
import { ref } from 'vue'
import type { TestimonialsSectionBlockData } from '~/types/page-blocks/testimonials-section'

const props = defineProps<{ data: TestimonialsSectionBlockData }>()

// 1) How long each flip takes:
const flipDuration = 600 // ms

// 2) Index state
const currentIndex = ref(0)

// 3) Cumulative rotation in degrees
const rotation = ref(0)
const flipping = ref(false)

// 4) Flip in a given direction, swap mid-animation:
const flipTo = (index: number) => {
  const direction = index > currentIndex.value ?  'left' : 'right'
  flip(index, direction)
}

const prev = () => {
  const i = currentIndex.value === 0
    ? props.data.testimonials.length - 1
    : currentIndex.value - 1
  flip(i, 'right')
}

const next = () => {
  const i = currentIndex.value === props.data.testimonials.length - 1
    ? 0
    : currentIndex.value + 1
  flip(i, 'left')
}

const flip = (newIndex: number, direction: 'left' | 'right') => {
  if (newIndex === currentIndex.value) return

  flipping.value = true

  const delta = direction === 'left' ? -180 : 180
  rotation.value += delta

  setTimeout(() => {
    currentIndex.value = newIndex
    flipping.value = false
  }, flipDuration / 2)

  setTimeout(() => {
    // flipping.value = false

  }, flipDuration)
}
</script>

<template>
  <Heading class="mb-4" :text="data.heading" />
  <p class="font-title italic text-2xl text-center">
    {{ data.averageRating }} stars across {{ data.totalReviewsCount }} ratings!
  </p>

  <div class="flex flex-col lg:flex-row gap-8 p-8 max-w-[60rem] mx-auto lg:h-[34rem]">
    <!-- Flip Card -->
    <div class="relative w-full lg:w-[40%] flex flex-col gap-4 h-[20rem] my-auto">
      <div 
        class="card-container z-10"
        :style="{
          transform: `scale(${flipping ? 1.1 : 1})`,
          transition: `all ${flipDuration / 2}ms ease-in-out`,
        }"
      >
        <div
          class="card-inner rounded-xl"
          :class="[ flipping ? 'shadow-2xl' : 'shadow-lg' ]"
          :style="{
            transform: `rotateY(${rotation}deg)`,
            transition: `transform ${flipDuration}ms ease-in-out, box-shadow ${flipDuration}ms ease-in-out`,
          }"
        >
          <!-- front face (always shows currentIndex) -->
          <div class="absolute inset-0 backface-hidden bg-background-accent dark:bg-background-accent-dark card-front rounded-xl">
            <TestimonialCard 
              :testimonial="data.testimonials[currentIndex]"
              @next="next"
              @previous="prev" 
            />
          </div>
          <!-- back face (always shows nextIndex) -->
          <div class="absolute inset-0 backface-hidden bg-background-accent dark:bg-background-accent-dark card-back rounded-xl">
            <TestimonialCard 
              :testimonial="data.testimonials[currentIndex]" 
              @next="next"
              @previous="prev"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-1 justify-center z-0">
        <button
          v-for="(_, i) in data.testimonials"
          :key="i"
          class="w-4 h-4 rounded-full cursor-pointer border border-accent dark:border-background-accent-dark transition-all duration-200"
          :class="currentIndex === i ? 'bg-accent dark:bg-background-accent-dark scale-125' : 'bg-background-accent dark:bg-background-dark'"
          @click="flipTo(i)"
        />
      </div>
    </div>

    <!-- Irregular Collage -->
    <div class="relative hidden lg:block w-full lg:w-[60%] h-full overflow-hidden">
      <div class="absolute flex flex-wrap justify-center items-center gap-4 px-4 py-4 h-full z-0">
        <div
          v-for="(t, i) in data.testimonials.slice(0, 5)"
          :key="i"
          class="bg-background-accent dark:bg-background-accent-dark rounded-lg p-4 shadow flex flex-col max-w-[45%] cursor-pointer"
          @click="flipTo(i)"
        >
          <!-- thumbnail content -->
          <div class="flex justify-between gap-4">
            <div class="flex items-center mb-2">
              <svg
                v-for="n in 5"
                :key="n"
                class="h-4 w-4"
                :class="n <= t.starRating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.98a1
                     1 0 00.95.69h4.18c.969 0 1.371 1.24.588
                     1.81l-3.385 2.462a1 1 0 00-.364
                     1.118l1.286 3.98c.3.921-.755 1.688-1.54
                     1.118l-3.385-2.462a1 1 0 00-1.175
                     0l-3.385 2.462c-.784.57-1.84-.197-1.54-1.118l1.286-3.98a1
                     1 0 00-.364-1.118L2.045 9.407c-.783-.57-.38-1.81.588-1.81h4.18a1
                     1 0 00.95-.69l1.286-3.98z" />
              </svg>
            </div>
            <div class="w-8 h-8">
              <TestimonialIcon :source="t.source" />
            </div>
          </div>
          <p class="text-xs line-clamp-3 mb-2">{{ t.text }}</p>
          <div class="mt-auto text-xs">
            <span>{{ t.authorsName }}</span><span class="mx-1">·</span
            ><span>{{ new Date(t.date).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  perspective: 1200px;
  width: 100%;
  height: 100%;
}
.card-inner {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  position: relative;
}
.card-face-test {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  background-color: var(--color-background-accent);
}
.card-front {
  transform: rotateY(0deg);
}
.card-back {
  transform: rotateY(180deg);
}
</style>
