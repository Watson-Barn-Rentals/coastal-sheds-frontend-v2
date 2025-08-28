<script setup lang="ts">

defineProps<{
  backgroundOption: "none" | "color_background" | "image_background" | "video_background";
  backgroundColor: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  fadeTopAndBottom: boolean;
}>();

</script>

<template>
    <div 
        v-if="backgroundOption === 'color_background' && backgroundColor"
        :class="{ 'fade-top-bottom-mask': fadeTopAndBottom }"
        :style="{
            backgroundColor: backgroundColor,
        }"
    >
        <slot />
    </div>
    <div 
        v-else-if="backgroundOption === 'image_background' && backgroundImageUrl"
        :class="{ 'fade-top-bottom-mask': fadeTopAndBottom }"
        :style="{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }"
    >
        <slot />
    </div>
    <div 
      v-else-if="backgroundOption === 'video_background' && backgroundVideoUrl"
      class="relative overflow-hidden"
      :class="{ 'fade-top-bottom-mask': fadeTopAndBottom }"
    >
      <video
        class="absolute top-0 left-0 w-full h-full object-cover object-center"
        :src="backgroundVideoUrl"
        autoplay
        muted
        loop
        playsinline
      />
      <div class="relative z-10">
        <slot />
      </div>
    </div>
    <div v-else >
        <slot />
    </div>
</template>

<style>
.fade-top-bottom-mask {
  /* Safari/WebKit */
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,1) var(--fade-top, 10%),
    rgba(0,0,0,1) calc(100% - var(--fade-bottom, 10%)),
    rgba(0,0,0,0) 100%
  );
  /* Others */
  mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,1) var(--fade-top, 10%),
    rgba(0,0,0,1) calc(100% - var(--fade-bottom, 10%)),
    rgba(0,0,0,0) 100%
  );
}

</style>