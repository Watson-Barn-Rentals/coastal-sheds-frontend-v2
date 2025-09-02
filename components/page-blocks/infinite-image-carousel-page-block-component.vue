<script setup lang="ts">
import type { InfiniteImageCarouselBlockData } from '~/types/page-blocks/infinite-image-carousel';


defineProps<{
  data: InfiniteImageCarouselBlockData
}>()
</script>

<template>
  <UPageMarquee
    class="
      my-16
      py-2 [--duration:40s]
      relative overflow-hidden

      /* left overlay: stays solid for first half, then fades */
        before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-24
        before:bg-gradient-to-r 
        before:from-[var(--color-background)] 
        dark:before:from-[var(--color-background-dark)] 
        before:via-[var(--color-background)] 
        dark:before:via-[var(--color-background-dark)] 
        before:to-transparent

      /* right overlay: same in reverse */
        after:content-['']  after:absolute after:inset-y-0 after:right-0 after:w-24
        after:bg-gradient-to-l 
        after:from-[var(--color-background)] 
        dark:after:from-[var(--color-background-dark)] 
        after:via-[var(--color-background)] 
        dark:after:via-[var(--color-background-dark)] 
        after:to-transparent
    "
    :style="{
      '--duration': `${data.loopTimeInSeconds}s`
    }"
  >
    <Motion
      v-for="(img, index) in data.images"
      :key="index"
      :initial="{ scale: 1.1, opacity: 0, filter: 'blur(0px)' }"
      :enter="{
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.6, delay: index * 0.1 }
      }"
      appear
      class="inline-block flex-none"
    >
      <div
          class="rounded-lg transform overflow-hidden"
          :style="{
            rotate: index % 2 === 0 ? `-${data.maxImageRotation}` : data.maxImageRotation,
            width: '20rem',
            maxWidth: '90vw',
          }"
      >
        <ResponsiveImage
          :image-media-item="img"
        />
      </div>
    </Motion>
  </UPageMarquee>
</template>
