<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import type { ParagraphWithAccentImageBlockData } from '~/types/page-blocks/paragraph-with-accent-image';

const props = defineProps<{
  data: ParagraphWithAccentImageBlockData;
}>();

useCustomCss(props.data.customImageStyling.css);

</script>

<template>
  <MaxWidthContentWrapper>
    <div
      class="
        bg-background-accent dark:bg-background-accent-dark
        rounded-xl shadow-lg relative overflow-visible
      "
      :class="props.data.alignment === 'left' ? 'align-left' : 'align-right'"
      :style="{
        // Expose dynamic values as CSS vars for responsive rules below
        '--img-width': props.data.imageWidth,
        '--img-pad': props.data.imagePadding,
        '--img-hoff': props.data.horizontalImageOffset,
        '--img-voff': props.data.verticalImageOffset,
        '--img-rotate': props.data.imageRotation
      } as any"
    >
      <div class="image-wrap" :class="props.data.alignment">
        <ResponsiveImage
          :imageMediaItem="props.data.image"
          :dont-use-placeholder="props.data.disableImagePlaceholder"
          :class="twMerge('block w-full h-auto md:rotate-[var(--img-rotate)]', props.data.customImageStyling.classNames.join(' '))"
        />
      </div>

      <Heading
        :text="props.data.title"
        heading-level="h2"
        text-alignment="center"
        class="pt-8"
      />

      <WysiwygRenderer class="p-8" :content="props.data.text" />

      <!-- Ensure float is cleared on desktop -->
      <div class="hidden md:block clear-both"></div>
    </div>
  </MaxWidthContentWrapper>
</template>

<style scoped>
/* Mobile-first: image on top, full width, no float/offsets */
.image-wrap {
  width: 100%;
  float: none;
  padding: 0;
}

/* Desktop (md+): restore float/offset behavior */
@media (min-width: 768px) {
  .align-left  { margin-left:  var(--img-hoff); }
  .align-right { margin-right: var(--img-hoff); }

  .image-wrap {
    width: var(--img-width);
    margin-top: calc(var(--img-voff) * -1);
    padding-bottom: var(--img-pad);
  }

  .image-wrap.left {
    float: left;
    margin-left:  calc(var(--img-hoff) * -1);
    padding-right: var(--img-pad);
  }

  .image-wrap.right {
    float: right;
    margin-right: calc(var(--img-hoff) * -1);
    padding-left:  var(--img-pad);
  }
}
</style>
