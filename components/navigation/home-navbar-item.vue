<script setup lang="ts">

defineProps<{
    logoUrl: string
}>()

</script>

<template>
    <a
        href="/"
        class="font-title pb-1 pt-2 px-0 flex flex-col cursor-pointer md:text-base shrink-0"
    >
        <div class="h-full">
            <div class="w-full h-full flex items-center justify-center">
              <img 
                :src="logoUrl" 
                alt="Logo" 
                class="max-w-full max-h-full object-contain"
              />
            </div>
        </div>
    </a>
</template>
