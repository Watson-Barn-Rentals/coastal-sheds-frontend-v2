<script setup lang="ts">
import { isPageBlock, resolvePageBlockComponent, type PageBlock } from '~/types/page-blocks';

defineProps<{
    pageBlocks: PageBlock[];
}>();

const isDevMode = ref<boolean>(import.meta.dev);

</script>

<template>
  <div
    v-for="(block, index) in pageBlocks"
    :key="index"
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
   
</template>