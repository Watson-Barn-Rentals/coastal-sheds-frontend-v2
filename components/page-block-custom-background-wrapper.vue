<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '#imports'
import type { CustomCssStyling } from '~/types/custom-css-styling';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const props = defineProps<{
  backgroundOption: "none" | "color_background" | "image_background" | "video_background";
  backgroundColor: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  fadeTopAndBottom: boolean;
  customCssStyling: CustomCssStyling;
}>()

useCustomCss(props.customCssStyling.css)

// ✅ function form + literal 'as' fixes the types
useHead(() => ({
  link: (props.backgroundOption === 'image_background' && props.backgroundImageUrl)
    ? [
        {
          rel: 'preload',
          as: 'image' as const,          // <- important: literal, not string
          href: props.backgroundImageUrl,
          // If the image is on a different origin, uncomment the next line:
          // crossorigin: 'anonymous' as const,
        }
      ]
    : []
}))
</script>

<template>
  <!-- COLOR -->
  <div
    v-if="backgroundOption === 'color_background' && backgroundColor"
    :class="twMerge(clsx({ 'fade-top-bottom-mask': fadeTopAndBottom }, customCssStyling.classNames))"
    :style="{ backgroundColor }"
  >
    <slot />
  </div>
  <!-- IMAGE -->
  <div
  v-else-if="backgroundOption === 'image_background' && backgroundImageUrl"
  :class="twMerge(clsx({ 'fade-top-bottom-mask': fadeTopAndBottom }), customCssStyling.classNames.join(' '))"
  :style="{
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }"
  >
    <!--
      Hidden <img> to eagerly fetch the same URL.
      This ensures the resource is fetched even if the element
      starts off-screen and the browser would otherwise defer it.
    -->
    <img
      v-if="backgroundImageUrl"
      :src="backgroundImageUrl"
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchpriority="high"
      style="display:none"
    />
    <slot />
  </div>

  <!-- VIDEO -->
  <div
    v-else-if="backgroundOption === 'video_background' && backgroundVideoUrl"
    class="relative overflow-hidden"
    :class="twMerge(clsx({ 'fade-top-bottom-mask': fadeTopAndBottom }, customCssStyling.classNames))"
  >
    <video
      class="absolute top-0 left-0 w-full h-full object-cover object-center"
      :src="backgroundVideoUrl"
      autoplay
      muted
      loop
      playsinline
    />
    <div class="relative z-10">
      <slot />
    </div>
  </div>

  <!-- NONE -->
  <div 
    v-else
    :class="twMerge(clsx({ 'fade-top-bottom-mask': fadeTopAndBottom }, customCssStyling.classNames))"
  >
    <slot />
  </div>
</template>

<style>
.fade-top-bottom-mask {
  /* Safari/WebKit */
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,1) var(--fade-top, 10%),
    rgba(0,0,0,1) calc(100% - var(--fade-bottom, 10%)),
    rgba(0,0,0,0) 100%
  );
  /* Others */
  mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,1) var(--fade-top, 10%),
    rgba(0,0,0,1) calc(100% - var(--fade-bottom, 10%)),
    rgba(0,0,0,0) 100%
  );
}
</style>
