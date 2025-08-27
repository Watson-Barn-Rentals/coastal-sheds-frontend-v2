<script setup lang="ts">
defineProps<{
  message: string
}>();
</script>

<template>
    <div
      class="group flex h-full flex-col gap-8 overflow-hidden rounded-2xl bg-background-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-background-accent-dark p-8 justify-center"
    >
      <p class="text-center text-[4rem]">😞</p>
      <p class="text-center text-xl">{{ message }}</p>
    </div>
</template>
