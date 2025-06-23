<script setup lang="ts">
import type { CoastalHomePageHeroBlockData } from '~/types/page-blocks/coastal-home-page-hero';

const props = defineProps<{
  data: CoastalHomePageHeroBlockData;
}>();
</script>

<template>
  <section class="relative h-[30rem] md:h-[35rem] overflow-hidden">
    <div class="absolute inset-0 z-0">
      <div class="relative h-[75%]">
        <div
          class="absolute inset-0 bg-blue-900"
          style="clip-path: url(#gradiant2Clip);"
        ></div>
        <div
          class="absolute inset-0"
          style="background: linear-gradient(to left, orange, gold); clip-path: url(#gradiantClip);"
        ></div>
        <div class="absolute inset-0" style="clip-path: url(#heroClip);">
          <ResponsiveImage
            :imageMediaItem="data.backgroundImage"
            object-position="50% 26%"
          />
        </div>
        <div
          class="absolute left-0 top-0 sm:top-auto sm:bottom-8 w-full sm:w-1/2 sm:pt-0 p-4 sm:p-8 text-start"
        >
          <h1
            class="font-title text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] italic font-bold select-none bg-gradient-to-b from-yellow-500 via-yellow-500 to-white bg-clip-text text-transparent leading-none medium-black-glow"
          >
            {{ data.title }}
          </h1>
        </div>
      </div>
    </div>
    <div
      class="absolute right-0 w-1/2 h-[95%] sm:h-[90%] flex flex-col justify-center pr-4 sm:px-8"
      :style="{ top: data.logoTopOffset }"
    >
      <div class="w-full max-w-[30rem] max-h-full mx-auto flex sm:justify-center">
          <ResponsiveImage
            :imageMediaItem="data.logoImage"
            dont-use-placeholder
            class="small-white-glow"
          />
      </div>
    </div>
    <div
      class="absolute left-0 top-[75%] h-[25%] w-full sm:w-1/2 flex flex-col justify-end"
    >
      <div class="p-4 pt-16 sm:p-8 h-full">
        <div class="h-full flex flex-col justify-end gap-4 sm:gap-8 max-h-[12rem]">
          <div class="flex justify-around sm:justify-start gap-4 sm:gap-8">
            <NuxtLink to="/products">
              <button
                class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
              >
                <UIcon
                  name="f7:hammer-fill"
                  dynamic
                  class="group-hover:animate-hammer h-6 w-6 my-auto sm:h-8 sm:w-8 text-white"
                />
                <p
                  class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto"
                >
                  Explore Styles
                </p>
              </button>
            </NuxtLink>
            <NuxtLink to="Browse Inventory">
              <button
                class="flex gap-2 p-3 rounded-lg bg-accent text-slate-800 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
              >
                <p
                  class="font-title select-none font-semibold text-sm sm:text-base my-auto"
                >
                  Browse Inventory
                </p>
                <UIcon
                  name="material-symbols:arrow-forward-rounded"
                  class="group-hover:animate-arrow-loop h-6 w-6 my-auto sm:h-8 sm:w-8"
                />
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
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
  <svg class="absolute w-0 h-0">
    <defs>
      <clipPath id="heroClip" clipPathUnits="objectBoundingBox">
        <path d="M0 0 1 0V.88Q.8.81.46.9.14 1.01 0 .92Z" />
      </clipPath>
    </defs>
  </svg>
</template>

<style scoped>
.small-white-glow {
  filter: drop-shadow(0 0 2px white) drop-shadow(0 0 4px white);
}
.medium-black-glow {
  filter: drop-shadow(0 0 4px black) drop-shadow(0 0 8px black);
}
</style>
