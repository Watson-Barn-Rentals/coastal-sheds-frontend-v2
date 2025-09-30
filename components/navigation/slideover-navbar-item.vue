<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import type { MenuItem, SubMenuItem } from '~/types/header-settings'

const props = defineProps<{
  menuItem: MenuItem
}>()

const emit = defineEmits<{
  (e: 'close-mobile-menu'): void
}>()

const route = useRoute()
const dropdownState = ref<boolean>(false)

const strippedPageUrl = computed(() =>
  route.path
    .replace(/[?#].*$/, '')         // remove query params and hash
    .replace(/(.+?)\/+$/, '$1')     // remove trailing slashes unless it's just "/"
)

const isActive = computed<boolean>(() => strippedPageUrl.value === props.menuItem.url)
const subItemIsActive = (subItem: SubMenuItem) => strippedPageUrl.value === subItem.url

const handleClick = () => { dropdownState.value = !dropdownState.value }


</script>

<template>
    <NuxtLink
      v-if="!menuItem.has_children && menuItem.url"
      :to="menuItem.url"
      class="mr-auto"
    >
      <li
        class="font-title flex gap-2 text-xl border-b-2 pb-1"
        :class="{
          'border-black dark:border-white hover:border-hovered-link': isActive,
          'border-transparent': !isActive
        }"
        @click="emit('close-mobile-menu')"
      >
        <div class="flex gap-1 lg:gap-1.5">
          <UIcon
            v-if="menuItem.icon"
            :name="menuItem.icon"
            class="my-auto h-5 w-5"
          />
          <span class="select-none text-nowrap my-auto">{{ menuItem.text }}</span>
        </div>
      </li>
    </NuxtLink>

    <div v-else class="flex flex-col gap-2">
      <li
        class="relative font-title flex gap-2 text-xl cursor-pointer border-b-2 border-transparent pb-1 mr-auto"
        @click="handleClick"
      >
        <div class="flex gap-1 lg:gap-1.5">
          <UIcon
            v-if="menuItem.icon"
            :name="menuItem.icon"
            class="my-auto h-5 w-5"
          />
          <span class="select-none text-nowrap my-auto">{{ menuItem.text }}</span>
          <UIcon
            v-if="menuItem.has_children"
            name="material-symbols:chevron-right-rounded"
            class="mt-auto hh-5 w-5 duration-300 ease-in-out"
            :class="{
              '-rotate-90': dropdownState,
              'rotate-90': !dropdownState
            }"
          />
        </div>
      </li>        
      <div v-if="dropdownState" class="flex flex-col gap-4 pl-8 pb-4">
          <NuxtLink
            v-for="(subItem, subIndex) in menuItem.children"
            :to="subItem.url"
            class="mr-auto"
          >
            <li
              class="font-title flex gap-2 text-xl border-b-2 pb-1"
              :class="{
                'border-black hover:border-hovered-link': subItemIsActive(subItem),
                'border-transparent': !subItemIsActive(subItem)
              }"
              @click="emit('close-mobile-menu')"
            >
              <div class="flex gap-1 lg:gap-1.5">
                <UIcon
                  v-if="subItem.icon"
                  :name="subItem.icon"
                  class="my-auto h-5 w-5"
                />
                <span class="select-none text-nowrap my-auto">{{ subItem.text }}</span>
              </div>
            </li>
          </NuxtLink>
        </div>
    </div>
</template>
