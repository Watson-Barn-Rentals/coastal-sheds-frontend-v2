<script setup lang="ts">
import { isPageBlock, resolvePageBlockComponent, type PageBlock } from '~/types/page-blocks';

defineProps<{
    pageBlocks: PageBlock[];
}>();

</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="(block, index) in pageBlocks"
      :key="index"
      :style="{
        marginBottom: block.spaceAfter ?? '0'
      }"
    >
      <component
        v-if="isPageBlock(block)"
        :is="resolvePageBlockComponent(block.type)"
        :data="block.data"
      />
      <div v-else class="h-48 flex flex-col justify-center">
        <p class="text-center text-2xl">Something went wrong when displaying this component!</p>
      </div>
    </div>
  </div>
   
</template>