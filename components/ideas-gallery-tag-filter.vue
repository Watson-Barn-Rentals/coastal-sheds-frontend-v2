<script setup lang="ts">
defineProps<{
    isActive: boolean
	title: string
}>();
</script>

<template>
	<div
		:class="[
			'cursor-pointer rounded-full border px-4 py-3 text-sm md:px-8 md:py-4 md:text-lg font-medium leading-none',
			isActive
				? 'border-2 border-brand bg-background-accent'
				: 'border-1 border-background-accent bg-background',
		]"
	>
		{{ title }}
	</div>
</template>
