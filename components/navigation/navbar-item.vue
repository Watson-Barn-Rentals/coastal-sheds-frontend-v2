<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import type { MenuItem } from '~/types/header-settings';

const props = defineProps<{
    menuItem: MenuItem
}>()

const route = useRoute()

const dropdownState = ref<boolean>(false)


const isActive = computed<boolean>(() => {
    return route.path === props.menuItem.url
})


const handleClick = () => {
    dropdownState.value = true
}
</script>

<template>
    <NuxtLink
        v-if="!menuItem.has_children && menuItem.url"
        :to="menuItem.url"
    >
    <li
        class="relative font-title pb-1 pt-2 px-0 flex flex-col cursor-pointer border-b-2"
        :class="{
            'border-black': isActive,
            'border-transparent': !isActive
        }"
    >
        <div class="flex gap-1 lg:gap-1.5">
            <UIcon
                v-if="menuItem.icon"
                :name="menuItem.icon"
                class="my-auto h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6"
            />
            <span class="select-none text-nowrap my-auto">{{ menuItem.text }}</span>
        </div>
    </li>
    </NuxtLink>
    <UPopover
        v-else
        v-model:open="dropdownState"
        :content="{
            side: 'bottom',
            sideOffset: 20
        }"
        :ui="{
            content: 'bg-background dark:bg-background-dark border-2 border-background-accent dark:border-background-accent-dark rounded-lg shadow-xl p-4'
        }"
    >
    <li
        class="relative font-title pb-1 pt-2 px-0 flex flex-col cursor-pointer border-b-2"
        :class="{
            'border-black': menuItem.url && isActive,
            'border-transparent': !isActive || !menuItem.has_children
        }"
        @click="handleClick"
    >
        <div class="flex gap-1 lg:gap-1.5">
            <UIcon
                v-if="menuItem.icon"
                :name="menuItem.icon"
                class="my-auto h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6"
            />
            <span class="select-none text-nowrap my-auto">{{ menuItem.text }}</span>
            <UIcon
                v-if="menuItem.has_children"
                name="material-symbols:chevron-right-rounded"
                class="mt-auto h-4 w-4 md:h-5 md:w-5 duration-300 ease-in-out"
                :class="{
                    '-rotate-90': dropdownState,
                    'rotate-90': !dropdownState
                }"
            />
        </div>
    </li>
    <template #content >
        <NuxtLink
            v-for="(subItem, index) in menuItem.children"
            :key="`sub-menu-item-${index}`" 
            :to="subItem.url"
            class="flex gap-1 lg:gap-1.5"
        >
            <UIcon
                v-if="subItem.icon"
                :name="subItem.icon"
                class="my-auto h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6"
            />
            <span class="select-none text-nowrap my-auto">{{ subItem.text }}</span>
        </NuxtLink>
    </template>
    </UPopover>
</template>
