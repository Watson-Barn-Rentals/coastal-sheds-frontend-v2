<script setup lang="ts">
const props = defineProps<{
	starRating: number;
	authorsName: string;
	reviewText: string;
	reviewSource: string;
	textFontFamily: string;
	cardWidth: string;
	cardHeight: string;
	cardScale: number;
	cardOpacity: number;
	cardZIndex: number;
	cardLeftOffset: string;
	cardTopOffset: string;
	transitionDurationMs: number;
	cardPadding: string;
	cardBackgroundColor: string;
	cardBackgroundColorDarkMode: string;
	cardBorderColor: string;
	cardBorderColorDarkMode: string;
	cardBorderThickness: string;
	cardBorderRadius: string;
	cardTextColor: string;
	cardTextColorDarkMode: string;
    reviewTextLineClamp: number;
    authorsNameTextSize: string;
    reviewTextSize: string;
}>();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
</script>

<template>
	<div
		class="absolute transition-all h-full flex flex-col gap-2 justify-between overflow-hidden"
		:style="{
			borderWidth: cardBorderThickness,
			borderRadius: cardBorderRadius,
			borderColor: isDark ? cardBorderColorDarkMode : cardBorderColor,
			backgroundColor: isDark
				? cardBackgroundColorDarkMode
				: cardBackgroundColor,
			padding: cardPadding,
			transitionDuration: `${transitionDurationMs}ms`,
			left: cardLeftOffset,
			top: cardTopOffset,
			zIndex: cardZIndex,
			opacity: cardOpacity,
			width: cardWidth,
			height: cardHeight,
			scale: cardScale,
		}"
	>
		<div class="flex justify-between gap-2">
			<div class="flex flex-col">
				<span
					:style="{
						fontFamily: textFontFamily,
						color: isDark ? cardTextColorDarkMode : cardTextColor,
                        fontSize: authorsNameTextSize,
					}"
					>{{ authorsName }}</span
				>
				<ReviewStars :numberStars="starRating" />
			</div>
			<div class="w-10 h-10">
				<TestimonialIcon :source="reviewSource" />
			</div>
		</div>
		<div class="grow">
			<p
				class="clamp-text"
				:style="{
					fontFamily: textFontFamily,
					color: isDark ? cardTextColorDarkMode : cardTextColor,
                    fontSize: reviewTextSize,
				}"
			>
				{{ reviewText }}
			</p>
		</div>
	</div>
</template>

<style scoped>
.clamp-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: v-bind(reviewTextLineClamp); /* Show up to 3 lines */
  line-clamp: v-bind(reviewTextLineClamp);
}
</style>