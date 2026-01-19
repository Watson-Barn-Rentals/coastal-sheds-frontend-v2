<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ImageMediaItem } from "~/types/image-media-item";
import type { WatsonCarportsHeroBlockData } from "~/types/page-blocks/watson-carports-hero";

const props = defineProps<{
	data: WatsonCarportsHeroBlockData;
}>();

type SlideData = {
	visible: boolean;
	title: string;
	subtitle: string;
	image: ImageMediaItem;
};

const slideOne = ref<SlideData | null>(null);
const slideTwo = ref<SlideData | null>(null);
const slideOneActive = ref(true);
const slideIndex = ref(0);

const initSlides = () => {
	slideIndex.value = 0;

	slideOne.value = {
		visible: true,
		title: props.data.slides[slideIndex.value].title,
		subtitle: props.data.slides[slideIndex.value].subtitle,
		image: props.data.slides[slideIndex.value].image,
	};

	slideTwo.value = {
		visible: false,
		title: props.data.slides[slideIndex.value].title,
		subtitle: props.data.slides[slideIndex.value].subtitle,
		image: props.data.slides[slideIndex.value].image,
	};
};

const transtionSlides = () => {
	if (slideIndex.value + 1 >= props.data.slides.length) {
		slideIndex.value = 0;
	} else {
		slideIndex.value += 1;
	}

	if (slideOneActive.value) {
		slideTwo.value = {
			visible: true,
			title: props.data.slides[slideIndex.value].title,
			subtitle: props.data.slides[slideIndex.value].subtitle,
			image: props.data.slides[slideIndex.value].image,
		};

		if (slideOne.value) {
			slideOne.value.visible = false;
		}
		slideOneActive.value = false;
	} else {
		slideOne.value = {
			visible: true,
			title: props.data.slides[slideIndex.value].title,
			subtitle: props.data.slides[slideIndex.value].subtitle,
			image: props.data.slides[slideIndex.value].image,
		};

		if (slideTwo.value) {
			slideTwo.value.visible = false;
		}
		slideOneActive.value = true;
	}

	setInterval(() => {
		regeneratePixels();
	}, props.data.slides[slideIndex.value].slideDurationSeconds * 1000);
};

const randomIntFromInterval = (min: number, max: number) => {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
};

type PixelEntry = {
	row: number;
	col: number;
	scale: number;
	visible: boolean;
	rotation: number;
};

const COLS = 7;
const ROWS = 50;

const pixels = ref<PixelEntry[]>([]);

const initPixels = () => {
	const next: PixelEntry[] = [];

	const scaleByCol = [1, 1, 0.8, 0.7, 0.6, 0.5, 0.4];
	const visibleByCol = [0.95, 0.8, 0.7, 0.45, 0.2, 0.1, 0.05];
	const rotationByCol = [0, 0, 0, 0, 5, 10, 15];

	for (let col = 0; col < COLS; col++) {
		for (let row = 0; row < ROWS; row++) {
			next.push({
				row,
				col,
				scale: scaleByCol[col] ?? 0.5,
				visible: Math.random() < visibleByCol[col],
				rotation: randomIntFromInterval(
					-rotationByCol[col],
					rotationByCol[col]
				),
			});
		}
	}

	pixels.value = next;
};

const regeneratePixels = () => {
	const chanceToChangeByCol = [0.001, 0.02, 0.05, 0.1, 0.25, 0.4, 0.6];
	const rotationByCol = [0, 0, 0, 0, 5, 10, 15];

	pixels.value.forEach((pixel, index) => {
		const chance = chanceToChangeByCol[pixel.col] ?? 0.3;

		if (Math.random() < chance) {
			pixels.value[index].visible = !pixel.visible;
			pixels.value[index].rotation = randomIntFromInterval(
				-rotationByCol[pixel.col],
				rotationByCol[pixel.col]
			);
		}
	});
};

initPixels();
initSlides();

onMounted(() => {
	setInterval(() => {
		transtionSlides();
	}, props.data.slides[slideIndex.value].slideDurationSeconds * 1000);

	setInterval(() => {
		regeneratePixels();
	}, 200);
});
</script>

<template>
	<section class="w-full">
		<!-- Mobile view -->
		<div class="relative w-full flex flex-col sm:hidden">
			<div class="relative aspect-[5/3] w-full">
				<!-- Pixels -->
				<div
					class="absolute bottom-0 left-0 w-1/2 z-10 grid grid-cols-50 grid-rows-7"
				>
					<div
						v-for="(pixel, index) in pixels"
						:key="`pixel-${index}`"
						class="bg-brand h-full aspect-square"
						:style="{
							'grid-column-start': pixel.row + 1,
							'grid-row-start': 6 - pixel.col + 1,
							scale: pixel.scale * 100 + '%',
							opacity: pixel.visible ? 1 : 0,
							transition: 'opacity 0.5s ease-in-out',
							transform: `rotate(${pixel.rotation}deg)`,
						}"
					/>
				</div>
				<div
					class="absolute bottom-0 left-1/2 w-1/2 z-10 grid grid-cols-50 grid-rows-7"
				>
					<div
						v-for="(pixel, index) in pixels"
						:key="`pixel-${index}`"
						class="bg-brand h-full aspect-square"
						:style="{
							'grid-column-start': pixel.row + 1,
							'grid-row-start': 6 - pixel.col + 1,
							scale: pixel.scale * 100 + '%',
							opacity: pixel.visible ? 1 : 0,
							transition: 'opacity 0.5s ease-in-out',
							transform: `rotate(${pixel.rotation}deg)`,
						}"
					/>
				</div>
				<div
					v-if="slideOne"
					:style="{
						opacity: slideOne.visible ? 1 : 0,
					}"
					class="absolute w-full h-full transition-opacity duration-1000"
				>
					<div class="w-full h-full object-cover">
						<ResponsiveImage
							:imageMediaItem="slideOne.image"
							class=""
						/>
					</div>
				</div>

				<div
					v-if="slideTwo"
					:style="{
						opacity: slideTwo.visible ? 1 : 0,
					}"
					class="absolute w-full h-full transition-opacity duration-1000"
				>
					<div class="object-cover">
						<ResponsiveImage
							:imageMediaItem="slideTwo.image"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>
			<div class="flex bg-brand h-[8rem] text-white">
				<div class="m-4 w-1/4 shrink-0 flex flex-col justify-center">
					<div class="object-contain">
						<ResponsiveImage
							:imageMediaItem="data.logo"
							class="w-full"
						/>
					</div>
				</div>
				<div class="relative grow flex flex-col justify-center m-4">
					<div
						v-if="slideOne"
						:style="{
							opacity: slideOne.visible ? 1 : 0,
						}"
						class="absolute w-full transition-all duration-1000"
					>
						<div
							class="text-lg font-semibold leading-tight text-center font-title"
						>
							{{ slideOne.title }}
						</div>
						<div
							class="mt-4 text-lg font-medium opacity-95 text-center font-title"
						>
							{{ slideOne.subtitle }}
						</div>
					</div>
					<div
						v-if="slideTwo"
						:style="{
							opacity: slideTwo.visible ? 1 : 0,
						}"
						class="absolute w-full transition-all duration-1000"
					>
						<div
							class="text-lg font-semibold leading-tight text-center font-title"
						>
							{{ slideTwo.title }}
						</div>
						<div
							class="mt-4 text-lg font-medium opacity-95 text-center font-title"
						>
							{{ slideTwo.subtitle }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Desktop view -->
		<div
			class="relative w-full hidden sm:flex h-[16rem] md:h-[20rem] lg:h-[24rem]"
		>
			<!-- Left panel -->
			<div
				class="relative shrink-0 bg-brand text-white flex items-center min-w-[16rem] grow"
			>
				<div
					v-if="slideOne"
					:style="{
						opacity: slideOne.visible ? 1 : 0,
						zIndex: slideOne.visible ? 20 : 10,
					}"
					class="absolute w-full h-full flex flex-col justify-start p-8 transition-all duration-1000"
				>
					<div class="mx-auto h-1/3">
						<ResponsiveImage
							:imageMediaItem="data.logo"
							class="w-full"
						/>
					</div>
					<div class="mt-8">
						<div
							class="text-xl md:text-2xl lg:text-4xl font-semibold leading-tight text-center font-title"
						>
							{{ slideOne.title }}
						</div>
						<div
							class="mt-4 text-lg md:text-xl font-medium opacity-95 text-center font-title"
						>
							{{ slideOne.subtitle }}
						</div>
						<div class="mt-4 relative transition-transform duration-150 hover:bottom-1">
							<NuxtLink
								to="#highlighted-products"
								class="font-title cursor-pointer flex flex-row gap-2 justify-center "
							>
								<div class="flex flex-col justify-center">
									<span class="text-center leading-none"
										>Scroll to Products</span
									>
								</div>
								<UIcon
									name="tabler:arrow-down-dashed"
									class="inline-block w-6 h-6"
								/>
							</NuxtLink>
						</div>
					</div>
				</div>
				<div
					v-if="slideTwo"
					:style="{
						opacity: slideTwo.visible ? 1 : 0,
						zIndex: slideTwo.visible ? 20 : 10,
					}"
					class="absolute w-full h-full flex flex-col justify-start p-8 transition-all duration-1000"
				>
					<div class="mx-auto h-1/3">
						<ResponsiveImage
							:imageMediaItem="data.logo"
							class="w-full"
						/>
					</div>
					<div class="mt-8">
						<div
							class="text-xl md:text-2xl lg:text-4xl font-semibold leading-tight text-center font-title"
						>
							{{ slideTwo.title }}
						</div>
						<div
							class="mt-4 text-lg md:text-xl font-medium opacity-95 text-center font-title"
						>
							{{ slideTwo.subtitle }}
						</div>
						<div class="mt-4 relative transition-transform duration-150 hover:bottom-1">
							<NuxtLink
								to="#highlighted-products"
								class="font-title cursor-pointer flex flex-row gap-2 justify-center "
							>
								<div class="flex flex-col justify-center">
									<span class="text-center leading-none"
										>Scroll to Products</span
									>
								</div>
								<UIcon
									name="tabler:arrow-down-dashed"
									class="inline-block w-6 h-6"
								/>
							</NuxtLink>
						</div>
					</div>
				</div>
			</div>

			<!-- Right panel (image) -->
			<div class="relative aspect-[5/3] h-full">
				<!-- Pixels -->
				<div
					class="absolute top-0 left-0 h-full z-10 grid grid-cols-7 grid-rows-50"
				>
					<div
						v-for="(pixel, index) in pixels"
						:key="`pixel-${index}`"
						class="bg-brand h-full aspect-square"
						:style="{
							'grid-column-start': pixel.col + 1,
							'grid-row-start': pixel.row + 1,
							scale: pixel.scale * 100 + '%',
							opacity: pixel.visible ? 1 : 0,
							transition: 'opacity 0.5s ease-in-out',
							transform: `rotate(${pixel.rotation}deg)`,
						}"
					/>
				</div>
				<div
					v-if="slideOne"
					:style="{
						opacity: slideOne.visible ? 1 : 0,
					}"
					class="absolute w-full h-full transition-opacity duration-1000"
				>
					<div class="w-full h-full object-cover">
						<ResponsiveImage
							:imageMediaItem="slideOne.image"
							class=""
						/>
					</div>
				</div>

				<div
					v-if="slideTwo"
					:style="{
						opacity: slideTwo.visible ? 1 : 0,
					}"
					class="absolute w-full h-full transition-opacity duration-1000"
				>
					<div class="object-cover">
						<ResponsiveImage
							:imageMediaItem="slideTwo.image"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
