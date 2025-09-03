<script lang="ts" setup>
import type { slideover } from '#build/ui'
import { getHeaderSettings } from '~/services/api/get-header-settings'
import HomeNavbarItem from './navigation/home-navbar-item.vue'
import { vOnClickOutside } from '@vueuse/components'
import type { HeaderSettings } from '~/types/header-settings'

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const { data } = await useAsyncData<HeaderSettings>(
  'header-settings',
  () => getHeaderSettings()
)



</script>

<template>
    <div 
        v-if="data"
        :class="[
            'fixed top-0 left-0 w-full z-[100] flex px-4 py-2',
            'sm:justify-center justify-end'
        ]"
    >
    <header 
    :class="[
        'bg-background dark:bg-background-dark border-b-2 border-background-accent dark:border-background-accent-dark',
        'max-w-full rounded-full py-1 px-1',
        'shadow-xl border-2 border-background-accent dark:border-background-accent-dark',
    ]"
        >
            <div class="hidden sm:flex mx-2 h-full items-center justify-between">
                <nav class="flex gap-2 md:gap-4 lg:gap-6 w-full justify-center items-center my-auto">
                    <HomeNavbarItem 
                        :logo-url="data.logo_url"
                        class="h-12 lg:h-14 mx-1"
                    />
                    <NavigationNavbarItem 
                        v-for="(item, index) in data.menu"
                        :key="`navbar-item-${index}`"
                        :menu-item="item"
                        class="text-xs md:text-sm lg:text-base hover:text-hovered-link"
                    />
                    <NuxtLink
                        v-if="data.show_phone_call_to_action"
                        :to="`tel:${data.phone_call_to_action_phone_number}`"
                        class="bg-brand rounded-full flex flex-col items-center justify-center px-4 md:px-6 py-1 relative"
                    >
                        <span class="text-white text-nowrap text-xs md:text-sm">{{ data.phone_call_to_action_label }}</span>
                        <span class="text-nowrap font-bold text-white text-xs md:text-sm" >{{ data.phone_call_to_action_phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') }}</span>
                    </NuxtLink>
                    <ColorModeToggleButton v-if="data.show_display_mode_toggle" class="my-auto w-4 m-1" />
                </nav>
            </div>
            <div class="sm:hidden flex justify-center items-center p-1 h-full">
                <button
                    @click="toggleMenu"
                    class="focus:outline-none text-black dark:text-white h-8 w-8"
                >
                    <UIcon
                        name="material-symbols:menu-rounded"
                        class="h-8 w-8"
                    />
                </button>
            </div>
        </header>
    </div>

    
        <USlideover
            v-model:open="isMenuOpen"
            :ui="{
                content: 'bg-background dark:bg-background-dark',
                wrapper: 'fixed inset-0 flex z-50 w-[90vw] ml-[10vw] z-[9999999999]',
            }"
            color="white"
            side="right"
        >
            <template #content>
                <div class="flex">
                    <p class="h-24 max-w-1/2 m-4">
                        <div class="w-full h-full flex items-center justify-center">
                          <img 
                            :src="data?.logo_url" 
                            alt="Logo" 
                            class="max-w-full max-h-full object-contain"
                          />
                        </div>
                    </p>
                    <UIcon
                        name="material-symbols:close-rounded"
                        class="absolute top-4 right-4 h-12 w-12 text-black dark:text-white cursor-pointer"
                        @click="toggleMenu"
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <div>
                        
                    </div>
                </div>
            </template>
        </USlideover>
</template>