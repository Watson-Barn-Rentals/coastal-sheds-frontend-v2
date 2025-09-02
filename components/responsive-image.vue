<script setup lang="ts">
import type { ImageMediaItem } from "~/types/image-media-item";

const props = defineProps<{
  imageMediaItem: ImageMediaItem;
  objectPosition?: string;
  dontUsePlaceholder?: boolean;
}>();


const objectPositionValue = computed(() => props.objectPosition ?? "50% 50%");

const imgRef = ref<HTMLImageElement | null>(null);

const dynamicSizes = ref("1px");

const dynamicSrcset = computed(() => {
  if (props.dontUsePlaceholder) {
    return props.imageMediaItem.srcset;
  }
  return props.imageMediaItem.srcset + `, ${props.imageMediaItem.placeholder} 1w`;
});

function onLoad() {
  if (!imgRef.value) return;

  const elementWidthPx = imgRef.value.getBoundingClientRect().width;
  const viewportWidthPx = window.innerWidth;
  const widthInVw = (elementWidthPx / viewportWidthPx) * 100;
  dynamicSizes.value = `${widthInVw.toFixed(2)}vw`;
}

watch(() => imgRef.value?.complete, onLoad, { immediate: true });
</script>

<template>
    <img
      ref="imgRef"
      :srcset="dynamicSrcset"
      :sizes="dynamicSizes"
      :alt="imageMediaItem.alt"
      class="relative w-full h-full object-cover z-0"
      :style="{ objectPosition: objectPositionValue }"
      loading="lazy"
    />
</template>