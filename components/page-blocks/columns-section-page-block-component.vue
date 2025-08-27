<script setup lang="ts">
import type { dashboardToolbar } from '#build/ui-pro';
import type { ColumnsSectionPageBlockData } from '~/types/page-blocks/columns-section';
import type { ColumnSection } from '~/types/page-blocks/columns-section-index';

const props = defineProps<{
  data: ColumnsSectionPageBlockData;
}>();

const mobileColumnSections = computed(() =>
  props.data.columns
    .flatMap(column => column.columnSections)
    .filter(section => section.mobileOrder != null)
    .sort((a, b) => Number(a.mobileOrder) - Number(b.mobileOrder))
);


</script>

<template>
  <!-- Mobile Layout -->
  <div class="block md:hidden mx-8">
    <ColumnSectionRenderer :column-sections="mobileColumnSections" />
  </div>

  <!-- Desktop Layout -->
  <div class="hidden md:block mx-8">
    <div 
      class="flex justify-center gap-8 mx-auto"
      :style="{
        maxWidth: data.columnLayoutWidth === 'standard-max-width' ? '1200px' : '100%',
      }"
    >
      <div
        v-for="(column, columnIndex) in props.data.columns"
        :key="columnIndex"
        class="flex flex-col gap-8"
        :style="{
          width: `calc(${column.width} - ${((props.data.columns.length - 1) * 32) / props.data.columns.length}px)`,
        }"
      >
        <ColumnSectionRenderer :column-sections="column.columnSections" />
      </div>
    </div>
  </div>
</template>
