<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import type { CustomCssStyling } from '~/types/custom-css-styling';

const props = defineProps<{
    text: string;
    textAlignment: 'left' | 'center'
    headingLevel: 'h1' | 'h2' | 'h3' | 'p'
    customStyling?: CustomCssStyling
}>()

useCustomCss(props.customStyling?.css ?? '');
</script>

<template>
    <h1
        v-if="headingLevel === 'h1'"
        :class="twMerge('font-title font-bold text-2xl sm:text-3xl md:text-4xl select-none', customStyling?.classNames.join(' ') ?? '')"
        :style="{
            textAlign: textAlignment
        }"
    >
        {{ text }}
    </h1>
    <h2
        v-else-if="headingLevel === 'h2'"
        :class="twMerge('font-title font-bold text-xl sm:text-2xl md:text-3xl select-none', customStyling?.classNames.join(' ') ?? '')"
        :style="{
            textAlign: textAlignment
        }"
    >
        {{ text }}
    </h2>
    <h3
        v-else-if="headingLevel === 'h3'"
        :class="twMerge('font-title font-bold text-xl sm:text-xl md:text-2xl select-none', customStyling?.classNames.join(' ') ?? '')"
        :style="{
            textAlign: textAlignment
        }"
    >
        {{ text }}
    </h3>
    <p
        v-else-if="headingLevel === 'p'"
        :class="twMerge('font-title font-bold text-xl sm:text-xl md:text-2xl select-none', customStyling?.classNames.join(' ') ?? '')"
        :style="{
            textAlign: textAlignment
        }"
    >
        {{ text }}
    </p>
    <p
        v-else
        :class="twMerge('font-title font-bold text-xl sm:text-xl md:text-2xl select-none', customStyling?.classNames.join(' ') ?? '')"
        :style="{
            textAlign: textAlignment
        }"
    >
        {{ text }}
    </p>
</template>