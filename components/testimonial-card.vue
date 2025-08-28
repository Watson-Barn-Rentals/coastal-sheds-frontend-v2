<script setup lang="ts">
import type { TestimonialsSectionBlockData } from '~/types/page-blocks/testimonials-section';

defineProps<{ 
    testimonial: TestimonialsSectionBlockData['testimonials'][number] 
}>()

defineEmits([
    'next',
    'previous'
])
</script>


<template>
  <div class="flex h-full gap-2 py-8">
    <button 
        class="h-full cursor-pointer flex flex-col justify-center group" 
        @click="$emit('previous')"
    >
        <UIcon
            name="material-symbols:chevron-left-rounded"
            class="text-black dark:text-white h-12 w-12 group-hover:scale-125 transition-transform duration-200 group-active:text-slate-600 dark:group-active:text-slate-400 opacity-20"
        />
    </button>
      <div class="flex flex-col grow gap-4">
        <div class="flex gap-2">
          <div class="flex flex-col grow">
            <p class="text-xl font-semibold text-center mb-2 truncate">
              {{ testimonial.authorsName }}
            </p>
            <div class="flex justify-center mb-2">
              <svg
                v-for="n in 5"
                :key="n"
                class="h-5 w-5"
                :class="n <= testimonial.starRating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.98a1
                     1 0 00.95.69h4.18c.969 0 1.371 1.24.588
                     1.81l-3.385 2.462a1 1 0 00-.364
                     1.118l1.286 3.98c.3.921-.755 1.688-1.54
                     1.118l-3.385-2.462a1 1 0 00-1.175
                     0l-3.385 2.462c-.784.57-1.84-.197-1.54-1.118l1.286-3.98a1
                     1 0 00-.364-1.118L2.045 9.407c-.783-.57-.38-1.81.588-1.81h4.18a1
                     1 0 00.95-.69l1.286-3.98z"
                />
              </svg>
            </div>
            <p v-if="testimonial.date" class="text-sm text-center mb-2">
              {{ new Date(testimonial.date).toLocaleDateString() }}
            </p>
          </div>
          <div class="w-16 h-16 my-auto">
            <TestimonialIcon :source="testimonial.source" />
          </div>
        </div>
        <p class="text-sm text-center line-clamp-6">
          {{ testimonial.text }}
        </p>
      </div>
    <button 
        class="h-full cursor-pointer flex flex-col justify-center group" 
        @click="$emit('next')"
    >
        <UIcon
            name="material-symbols:chevron-right-rounded"
            class="text-black dark:text-white h-12 w-12 group-hover:scale-125 transition-transform duration-200 group-active:text-slate-600 dark:group-active:text-slate-400 opacity-20"
        />
    </button>
  </div>
</template>