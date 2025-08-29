<script setup lang="ts">
import type { ParagraphColumnSectionData } from '~/types/page-blocks/column-sections/paragraph-column-section';

const props = defineProps<{
  data: ParagraphColumnSectionData;
}>();

useCustomCss(props.data.bodyCustomStyling.css)
</script>

<template>
  <WysiwygRenderer 
    :content="data.text" 
    :style="{
      textAlign: data.textAlignment,
      fontFamily: data.bodyFont,
      fontSize: data.bodyTextSize,
      color: data.bodyTextColor
    }"
    :class="data.bodyCustomStyling.classNames.join(' ')"
  />
</template>
