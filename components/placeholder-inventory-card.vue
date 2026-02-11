<script setup lang="ts">
import { formatPrice, formatRoundedPrice } from "~/services/format-price";
import { getGoogleMapsLinkForAddress } from "~/services/get-google-maps-link-for-address";
import type { ImageMediaItem } from "~/types/image-media-item";

const props = defineProps<{
	serialNumber: string;
	size: string | null;
	productTitle: string;
	heroBase64svg: string | null;
}>();
</script>

<template>
	<a
		:href="`/inventory/${serialNumber}/`"
		class="group flex h-full flex-col overflow-hidden rounded-2xl bg-background-accent shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl dark:bg-background-accent-dark"
	>
		<div class="relative w-full aspect-[4/3]">
			<div class="absolute inset-0 h-full w-full object-contain aspect-[4/3]">
				<img
					v-if="heroBase64svg"
					:src="heroBase64svg"
					class="relative w-full h-full object-cover z-0 aspect-[4/3]"
					loading="lazy"
				/>
        <USkeleton v-else class="w-full h-full" />
			</div>
		</div>

		<div class="flex min-h-0 flex-1 flex-col gap-2 px-4 py-4">
			<p class="text-lg font-bold text-center">
				{{ size ? size + " " : "" }}{{ productTitle }}
			</p>

			<div class="flex gap-2 text-sm">
				<span class="font-bold shrink-0 my-auto">Product Line:</span>
				<USkeleton class="h-6 w-48" />
			</div>

			<div class="flex gap-2 text-sm">
				<span class="font-bold shrink-0 my-auto">New/Used:</span>
				<USkeleton class="h-6 w-18" />
			</div>

			<div class="flex gap-2 text-sm">
				<span class="font-bold shrink-0">Serial #:</span>
				<span>{{ serialNumber }}</span>
			</div>

			<div class="flex gap-2 text-sm">
				<span class="font-bold shrink-0 my-auto">Price:</span>
				<USkeleton class="h-6 w-24" />
			</div>

			<div class="flex gap-2 text-sm">
				<span class="font-bold shrink-0 my-auto">Location:</span>
				<USkeleton class="h-6 w-48" />
			</div>

			<div class="mt-auto"></div>
		</div>
	</a>
</template>
