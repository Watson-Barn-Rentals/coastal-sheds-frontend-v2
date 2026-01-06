<script setup lang="ts">
defineProps<{
  numberStars: number;
}>();
</script>
<template>
			<div class="flex justify-center">
				<svg
					v-for="n in 5"
					:key="n"
					class="h-5 w-5"
					:class="
						n <= numberStars
							? 'text-yellow-400'
							: 'text-gray-300'
					"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.98a1
                       1 0 00.95.69h4.18c.969 0 1.371 1.24.588
                       1.81l-3.385 2.462a1 1 0 00-.364
                       1.118l1.286 3.98c.3.921-.755 1.688-1.54
                       1.118l-3.385-2.462a1 1 0 00-1.175
                       0l-3.385 2.462c-.784.57-1.84-.197-1.54-1.118l1.286-3.98a1
                       1 0 00-.364-1.118L2.045 9.407c-.783-.57-.38-1.81.588-1.81h4.18a1
                       1 0 00.95-.69l1.286-3.98z"
					/>
				</svg>
			</div>
</template>