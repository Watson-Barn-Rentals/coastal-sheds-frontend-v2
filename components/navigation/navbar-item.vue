<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import type { MenuItem, SubMenuItem } from '~/types/header-settings'
import { toTrailing } from '~/utils/urls';

const props = defineProps<{ menuItem: MenuItem }>()

const route = useRoute()
const dropdownState = ref<boolean>(false)

/** normalize current route path to trailing-slash form (no query/hash) */
const currentPath = computed(() => {
	const raw = route.path.replace(/[?#].*$/, '')
	return toTrailing(raw)
})

const isActive = computed<boolean>(() => currentPath.value === toTrailing(props.menuItem.url))
const subItemIsActive = (subItem: SubMenuItem) => currentPath.value === toTrailing(subItem.url)

const handleClick = () => { dropdownState.value = true }

/** grid helpers unchanged ... */
const gridColumnCount = computed<number>(() => {
	const items = props.menuItem.children ?? []
	let maxCol = 1
	for (const item of items) {
		const start = Number.isFinite(item?.column_number) ? Math.max(1, Math.floor(item.column_number as number)) : 1
		const span = Number.isFinite(item?.column_span) ? Math.max(1, Math.floor(item.column_span as number)) : 1
		maxCol = Math.max(maxCol, start + span - 1)
	}
	return maxCol
})

function getGridPositionStyle(subItem: SubMenuItem) {
	const total = gridColumnCount.value || 1
	let start = Number.isFinite(subItem?.column_number) ? Math.max(1, Math.floor(subItem.column_number as number)) : 1
	start = Math.min(start, total)
	let span = Number.isFinite(subItem?.column_span) ? Math.max(1, Math.floor(subItem.column_span as number)) : 1
	span = Math.min(span, Math.max(1, total - start + 1))
	return { gridColumn: `${start} / span ${span}` }
}
</script>

<template>
	<a
		v-if="!menuItem.has_children && menuItem.url"
		:href="toTrailing(menuItem.url)"
	>
		<li
			class="relative font-title pb-1 pt-2 px-0 flex flex-col cursor-pointer border-b-2"
			:class="{
				'border-black hover:border-hovered-link': isActive,
				'border-transparent': !isActive
			}"
		>
			<div class="flex gap-1 lg:gap-1.5">
				<UIcon v-if="menuItem.icon" :name="menuItem.icon" class="my-auto h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
				<span class="select-none text-nowrap my-auto">{{ menuItem.text }}</span>
			</div>
		</li>
	</a>

	<UPopover v-else v-model:open="dropdownState" :content="{ side: 'bottom', sideOffset: 20 }" :ui="{ content: 'bg-background dark:bg-background-dark border-2 border-background-accent dark:border-background-accent-dark rounded-lg shadow-xl p-8' }">
		<li
			v-on-click-outside="() => (dropdownState = false)"
			class="relative font-title pb-1 pt-2 px-0 flex flex-col cursor-pointer border-b-2"
			:class="{
				'border-black hover:border-hovered-link': menuItem.url && isActive,
				'border-transparent': !isActive || !menuItem.has_children
			}"
			@click="handleClick"
		>
			<div class="flex gap-1 lg:gap-1.5">
				<UIcon v-if="menuItem.icon" :name="menuItem.icon" class="my-auto h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
				<span class="select-none text-nowrap my-auto">{{ menuItem.text }}</span>
				<UIcon v-if="menuItem.has_children" name="material-symbols:chevron-right-rounded" class="mt-auto h-4 w-4 md:h-5 md:w-5 duration-300 ease-in-out" :class="{ '-rotate-90': dropdownState, 'rotate-90': !dropdownState }" />
			</div>
		</li>

		<template #content>
			<div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${gridColumnCount || 1}, minmax(0, 1fr))` }">
				<a
					v-for="(subItem, idx) in (menuItem.children ?? [])"
					:key="`sub-item-${idx}`"
					:href="toTrailing(subItem.url)"
					class="flex gap-1 lg:gap-1.5 cursor-pointer hover:text-hovered-link border-b-2 justify-center pb-1"
					:class="{ 'border-black hover:border-hovered-link': subItemIsActive(subItem), 'border-transparent': !subItemIsActive(subItem) }"
					:style="getGridPositionStyle(subItem)"
					@click="dropdownState = false"
				>
					<UIcon v-if="subItem.icon" :name="subItem.icon" class="my-auto h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
					<span class="select-none text-nowrap my-auto">{{ subItem.text }}</span>
				</a>
			</div>
		</template>
	</UPopover>
</template>
