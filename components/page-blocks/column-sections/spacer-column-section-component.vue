<script setup lang="ts">
import type { SpacerColumnSectionData } from '~/types/page-blocks/column-sections/spacer-column-section';


defineProps<{
  data: SpacerColumnSectionData
}>();
</script>

<template>
  <div
    :style="{
      height: data.height
    }"
  />
</template>
