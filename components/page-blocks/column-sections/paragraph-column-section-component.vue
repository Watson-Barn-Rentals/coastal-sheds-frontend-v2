<script setup lang="ts">
import type { ParagraphColumnSection, ParagraphColumnSectionData } from '~/types/page-blocks/column-sections/paragraph-column-section';

const props = defineProps<{
  data: ParagraphColumnSectionData;
}>();
</script>

<template>
  <WysiwygRenderer 
    :content="data.text" 
    :style="{
      textAlign: data.textAlignment,
    }"
  />
</template>
