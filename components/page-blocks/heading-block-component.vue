<script setup lang="ts">
import type { HeadingBlockData } from '~/types/page-blocks/heading';

defineProps<{
  data: HeadingBlockData;
}>();
</script>

<template>
  <Heading
    :text="data.content"
    :textAlignment="data.textAlignment"
    :headingLevel="data.headingLevel"
    :customStyling="data.customTextStyling"
    :style="{
      marginTop: data.topMargin,
      fontFamily: data.headingFont,
      fontSize: data.headingTextSize,
      color: data.headingTextColor
    }"
  />
</template>
