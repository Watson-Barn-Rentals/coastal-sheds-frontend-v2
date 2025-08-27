<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import type { ImageColumnSectionData } from '~/types/page-blocks/column-sections/image-column-section';

const props = defineProps<{
  data: ImageColumnSectionData;
}>();

useCustomCss(props.data.customImageStyling.css)
</script>

<template>
  <div
      :style="{
        'marginLeft': props.data.marginLeft,
        'marginRight': props.data.marginRight,
        'marginTop': props.data.marginTop,
        'marginBottom': props.data.marginBottom
      }"
  >
    <ResponsiveImage
      :imageMediaItem="props.data.image"
      :dont-use-placeholder="props.data.disableImagePlaceholder"
      :class="twMerge('block w-full h-auto ', props.data.customImageStyling.classNames.join(' '))"
      :style="{
        'rotate': props.data.imageRotation,
      }"
    />
  </div>
</template>
