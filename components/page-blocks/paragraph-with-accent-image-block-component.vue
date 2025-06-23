<script setup lang="ts">
import { routeLocationKey } from 'vue-router';
import type { ParagraphWithAccentImageBlockData } from '~/types/page-blocks/paragraph-with-accent-image';

const props = defineProps<{
  data: ParagraphWithAccentImageBlockData;
}>();
</script>

<template>
  <div class="w-full flex justify-center">
    <div
      class="
        w-full max-w-[60rem]
        bg-background-accent dark:bg-background-accent-dark
        rounded-xl
        m-16
        overflow-visible
        shadow-lg
        p-8
        relative
      "
    >
      <!--
        Instead of `relative -top-16`, we use a negative top margin (-mt-16).
        That pulls the float upward without leaving extra blank space.
        We also add a small left margin (ml-6) so text doesn’t butt right up
        against the image.
      -->
      <div 
        :style="{
          float: data.alignment,
          width: data.imageWidth,
          marginTop: `-${data.verticalImageOffset}`,
          marginLeft: data.alignment=== 'left' ? `-${data.horizontalImageOffset}` : '0',
          marginRight: data.alignment=== 'right' ? `-${data.horizontalImageOffset}` : '0',
          paddingBottom: data.imagePadding,
          paddingLeft: data.alignment=== 'right' ? data.imagePadding : '0',
          paddingRight: data.alignment=== 'left' ? data.imagePadding : '0',
        }"
      >
        <ResponsiveImage 
          :imageMediaItem="data.image" 
          :dont-use-placeholder="data.disableImagePlaceholder"
          :style="{ rotate: data.imageRotation}" 
          :class="data.imageStyling"
        />
      </div>

      <Heading :text="data.title" class="mb-4" />

      <!--
        The text will wrap around the floated image. Because we only “pulled”
        the image up, there’s no extra blank gap—paragraphs flow up under
        wherever the image now sits.
      -->
      <div class="font-title" v-html="data.text"></div>
    </div>
  </div>
</template>
