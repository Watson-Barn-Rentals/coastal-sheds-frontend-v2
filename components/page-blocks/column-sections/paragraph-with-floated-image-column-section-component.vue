<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { ParagraphWithFloatedImageColumnSectionData } from '~/types/page-blocks/column-sections/paragraph-with-floated-image-column-section'

const props = defineProps<{
  data: ParagraphWithFloatedImageColumnSectionData
}>()

useCustomCss(props.data.customImageStyling.css)
useCustomCss(props.data.bodyCustomStyling.css)
</script>

<template>
  <div>
    <!-- Floated image wrapper -->
    <div
      class="image-wrapper"
      :style="{
        '--img-float': props.data.imagePosition,
        '--img-width': props.data.imageWidth,
        '--img-bottom-pad': props.data.marginBottom,
        '--img-pad': `${props.data.marginTop} ${props.data.marginRight} ${props.data.marginBottom} ${props.data.marginLeft}`,
        '--img-rotate': props.data.imageRotation
      }"
    >
      <ResponsiveImage
        :imageMediaItem="props.data.image"
        :dont-use-placeholder="props.data.disableImagePlaceholder"
        :class="twMerge('block h-auto w-full max-w-full', props.data.customImageStyling.classNames.join(' '))"
        :style="{
          transform: props.data.imageRotation ? `rotate(${props.data.imageRotation})` : undefined,
        }"
      />
    </div>

    <!-- Text will flow around the floated image -->
    <WysiwygRenderer 
      :content="props.data.text" 
      :style="{
          fontFamily: data.bodyFont,
          fontSize: data.bodyTextSize,
          color: data.bodyTextColor
        }"
      :class="props.data.bodyCustomStyling.classNames.join(' ')"
    />

    <!-- Clear the float so the parent wraps the float + text -->
    <div class="clear-both"></div>
  </div>
</template>

<style scoped>
.image-wrapper {
  float: var(--img-float, left);
  width: var(--img-width, 100%); /* Fallback to full width if not set */
  margin: var(--img-pad, 0);
  transform: rotate(var(--img-rotate, 0deg));
}

@media (max-width: 768px) {
  .image-wrapper {
    float: none;
    width: 100%;
    margin: 0 0 var(--img-bottom-pad) 0;
  }
}
</style>
