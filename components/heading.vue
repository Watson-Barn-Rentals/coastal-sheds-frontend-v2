<script setup lang="ts">
defineProps<{
    text: string;
}>()
</script>

<template>
    <h2 class="font-title font-bold text-4xl text-center">
        {{ text }}
    </h2>
</template>