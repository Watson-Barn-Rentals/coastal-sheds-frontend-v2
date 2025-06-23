<script lang="ts" setup>

type FeatureData = {
  iconName: string;
  title: string;
  description: string;
};

const props = defineProps<{
  title: string;
  description: string;
  features: FeatureData[];
}>();

</script>

<template>
    
    <div class="flex flex-col gap-4">
        <h3 style="font-family: 'Segoe UI';" class="text-4xl font-bold text-center leading-none">{{ title }}</h3>
        <p style="font-family: 'Segoe UI';" class="text-lg text-center mb-4">{{ description }}</p>
        <div class="mx-auto w-[60rem] grid grid-cols-3 gap-8">
            <CardWDynamicBorderGlow                
                v-for="feature in features"
                :key="feature.title"
                :border-width-in-px="2"
                :border-radius-factor="5"
                default-border-color="transparent"
                glow-color="blue"
            >
                <div class="flex flex-col gap-2 bg-yellow-100 p-8">
                    <div class="flex">
                        <UIcon
                            :name="feature.iconName"
                            class="h-8 w-8 text-slate-800"
                        />
                    </div>
                    <h4 style="font-family: 'Segoe UI';" class="text-xl font-bold">{{ feature.title }}</h4>
                    <p style="font-family: 'Quicksand';" class="text-sm">{{ feature.description }}</p>
                </div>
            </CardWDynamicBorderGlow>
        </div>
    </div>
</template>