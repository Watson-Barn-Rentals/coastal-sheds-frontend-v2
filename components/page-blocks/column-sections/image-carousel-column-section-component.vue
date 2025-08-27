<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import type { ImageCarouselColumnSectionData } from '~/types/page-blocks/column-sections/image-carousel-column-section';

const props = defineProps<{
  data: ImageCarouselColumnSectionData;
}>();

useCustomCss(props.data.customImageStyling.css)
</script>

<template>
  <div
      :style="{
        'marginLeft': data.marginLeft,
        'marginRight': data.marginRight,
        'marginTop': data.marginTop,
        'marginBottom': data.marginBottom
      }"
  >
        <ImageCarousel 
          :images="data.images"
          :show-thumbnails="data.showThumbnails" 
          :loop="true"
          :image-classes="data.customImageStyling.classNames.join(' ')"
        />
  </div>
</template>
