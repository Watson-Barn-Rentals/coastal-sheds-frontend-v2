<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import { submitTrackingEvent } from '~/services/submit-tracking-event';
import type { LinkButtonsColumnSectionData } from '~/types/page-blocks/column-sections/link-buttons-column-section';


const props = defineProps<{
  data: LinkButtonsColumnSectionData;
}>();


// useCustomCss(props.data.b)

const handleClick = (trackingEventName: string) => {
  submitTrackingEvent(trackingEventName);
};
</script>

<template>

  <div 
    class="flex flex-wrap gap-8"
    :style="{
      'justify-content': data.buttonSpacing
    }"
  >
    <div
      v-for="(button, index) in props.data.buttons"
      :key="index"
    >
      <NuxtLink :to="button.destination">
        <button 
          :class="twMerge('flex gap-2 p-3 rounded-lg shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer', button.buttonStyling)"
          @click="handleClick(button.trackingEventName)"
        >
          <UIcon
            v-if="button.iconPresets === 'custom-icon'"
            :name="button.iconName ?? ''"
            :class="twMerge('h-6 w-6 my-auto sm:h-8 sm:w-8', button.customIconStyling.classNames.join(' '))"
          />
          <p
            class="font-title select-none font-semibold text-sm sm:text-base my-auto shrink-0"
          >
            {{ button.label }}
          </p>
          <UIcon
            v-if="button.iconPresets === 'animated-right-side-arrow'"
            name="material-symbols:arrow-forward-rounded"
            class="group-hover:animate-arrow-loop h-6 w-6 my-auto sm:h-8 sm:w-8"
          />
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
