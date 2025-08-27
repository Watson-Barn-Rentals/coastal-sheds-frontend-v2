<script setup lang="ts">
import type { HeadingColumnSectionData } from '~/types/page-blocks/column-sections/heading-column-section';

const props = defineProps<{
  data: HeadingColumnSectionData;
}>();
</script>

<template>
  <Heading
    :text="data.text"
    :textAlignment="data.textAlignment"
    :headingLevel="data.headingLevel"
    :customStyling="data.customTextStyling"
  />
</template>
