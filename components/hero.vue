<!-- File: components/HomePageHero.vue -->
<script lang="ts" setup>
import { NuxtLink, UIcon } from '#components';
import { computed } from 'vue';

const props = defineProps<{ 
  heroFileId: string 
}>()


</script>

<template>
<section class="relative w-full h-[10rem]">
    <div class="relative overflow-hidden h-full">
        <div
            class="absolute inset-0 bg-blue-900"
            style="clip-path: url(#gradiant2Clip);"
        />
        <div
            class="absolute inset-0"
            :style="{
                background: 'linear-gradient(to left, orange, gold)'
            }"
            style="clip-path: url(#gradiantClip);"
        />
        <div 
            v-if="props.heroFileId"
            class="absolute inset-0"
            :style="{
                backgroundImage: `url(${getAssetUrl(props.heroFileId)})`,
                backgroundSize: 'cover',
                backgroundPosition: '50% 26%',
                backgroundRepeat: 'no-repeat',
            }"
            style="clip-path: url(#heroClip);"
        />
        <div 
            class="absolute w-full h-full bg-black bg-opacity-20 flex flex-col justify-center items-center gap-16" 
            style="clip-path: url(#heroClip);" 
        />
        <h1 
            style="font-family: 'Segoe UI';"
            class="absolute bottom-16 left-8 text-[3.5rem] italic font-bold select-none bg-gradient-to-b from-yellow-500 via-yellow-500 to-white bg-clip-text text-transparent leading-none title-glow"
        >
          About Us
        </h1>
        <nav class="absolute top-0 right-0 list-none w-3/4 m-8 flex justify-end gap-8">
            <NuxtLink to="/about-us">
                <li
                    style="font-family: 'Segoe UI';"
                    class="text-xl text-white title-glow font-bold"
                >
                    About Us
                </li>
            </NuxtLink>
            <NuxtLink to="/products">
                <li
                    style="font-family: 'Segoe UI';"
                    class="text-xl text-white title-glow font-bold"
                >
                    Products
                </li>
            </NuxtLink>
            <NuxtLink to="/inventory">
                <li
                    style="font-family: 'Segoe UI';"
                    class="text-xl text-white title-glow font-bold"
                >
                    Inventory
                </li>
            </NuxtLink>
        </nav>
    </div>
</section>

<svg class="absolute w-0 h-0">
  <defs>
    <clipPath id="gradiant2Clip" clipPathUnits="objectBoundingBox">
      <path d="M0 0 1 0V.96Q.8.81.46.91.14 1.01 0 .99Z" />
    </clipPath>
  </defs>
</svg>
<svg class="absolute w-0 h-0">
  <defs>
    <clipPath id="gradiantClip" clipPathUnits="objectBoundingBox">
      <path d="M0 0 1 0V.94Q.8.81.458.907.14 1.01 0 .97Z" />
    </clipPath>
  </defs>
</svg>

<!-- Hero Image Clip Path -->
<svg class="absolute w-0 h-0">
  <defs>
    <clipPath id="heroClip" clipPathUnits="objectBoundingBox">
      <path d="M0 0 1 0V.88Q.8.81.46.9.14 1.01 0 .92Z" />
    </clipPath>
  </defs>
</svg>
</template>

<style>
.glow {
  filter: drop-shadow(0 0 2px white);
}
.title-glow {
  filter: drop-shadow(0 0 5px black) drop-shadow(0 0 10px black) drop-shadow(0 0 20px black);
}
</style>

