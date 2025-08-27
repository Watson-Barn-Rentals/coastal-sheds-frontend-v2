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
      <div v-else>
        <div class="p-8 bg-gray-100">
          <p class="text-red-500">
            Page block failed type check!
          </p>
          <pre class="bg-gray-100 rounded text-xs p-4">
            {{ block }}
          </pre>
        </div>
      </div>
    </div>
  </div>
   
</template>