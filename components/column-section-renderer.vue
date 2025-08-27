<script setup lang="ts">
import { isColumnSection, resolveColumnSectionComponent, type ColumnSection } from '~/types/page-blocks/columns-section-index';

defineProps<{
    columnSections: ColumnSection[]
}>();

</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="(section, index) in columnSections"
      :key="index"
      :style="{
        marginBottom: section.spaceAfter ?? '0'
      }"
    >
      <component
        v-if="isColumnSection(section)"
        :is="resolveColumnSectionComponent(section.type)"
        :data="section.data"
      />
      <div v-else>
        <div class="p-8 bg-gray-100">
          <p class="text-red-500">
            Column section failed type check!
          </p>
          <pre class="bg-gray-100 rounded text-xs p-4">
            {{ section }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>