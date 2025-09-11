<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import type { MenuItem, SubMenuItem } from '~/types/header-settings'

const props = defineProps<{
  menuItem: MenuItem
}>()

const route = useRoute()
const dropdownState = ref<boolean>(false)

const isActive = computed<boolean>(() => route.path === props.menuItem.url)
const subItemIsActive = (subItem: SubMenuItem) => route.path === subItem.url

const handleClick = () => { dropdownState.value = true }


</script>

<template>
    <NuxtLink
      v-if="!menuItem.has_children && menuItem.url"
      :to="menuItem.url"
    >
      <li
        class="font-title flex gap-2 text-xl"
        :class="{
          'border-black hover:border-hovered-link': isActive,
          'border-transparent': !isActive
        }"
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

    <li
      v-else
      v-on-click-outside="() => (dropdownState = false)"
      class="relative font-title flex gap-2 text-xl cursor-pointer"
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
</template>
