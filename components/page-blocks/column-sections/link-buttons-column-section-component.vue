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

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
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
      <a :href="button.destination">
        <button 
          class="flex gap-2 p-3 rounded-lg shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
          :style="{
            backgroundColor: isDark ? button.darkModeButtonColor : button.buttonColor,
            color: isDark ? button.darkModeTextColor : button.textColor
          }"
          @click="handleClick(button.trackingEventName)"
        >
          <UIcon
            v-if="button.iconPresets === 'custom-icon'"
            :name="button.iconName ?? ''"
            class="h-6 w-6 my-auto sm:h-8 sm:w-8"
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
      </a>
    </div>
  </div>
</template>
