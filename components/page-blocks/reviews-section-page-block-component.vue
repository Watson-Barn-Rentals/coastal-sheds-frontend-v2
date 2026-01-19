<script setup lang="ts">
import { card } from "#build/ui";
import type { ReviewsSectionBlockData } from "~/types/page-blocks/reviews-section";

const props = defineProps<{ data: ReviewsSectionBlockData }>();

const transitionDuration = ref(props.data.transitionSpeedMs); // ms

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const isLargeScreen = useMediaQuery(`(min-width: ${props.data.mobileVersionBreakpoint})`);

type CardPositionData = {
	index: number;
	topOffset: string;
	leftOffset: string;
	zIndex: number;
	opacity: number;
	scale: number;
};

const mobilePositionOneCardData = ref<CardPositionData>({
	index: 0,
	topOffset: `calc(2 * ${props.data.mobileTopOffset})`,
	leftOffset: `calc(50% - 2.5 * ${props.data.mobileCardWidth} + 2 * ${props.data.mobileCardOverlap})`,
	zIndex: 10,
	opacity: 0,
	scale: 0,
});
const mobilePositionTwoCardData = ref<CardPositionData>({
	index: 1,
	topOffset: `calc(${props.data.mobileTopOffset})`,
	leftOffset: `calc(50% - 1.5 * ${props.data.mobileCardWidth} + ${props.data.mobileCardOverlap})`,
	zIndex: 11,
	opacity: props.data.mobileSideCardOpacity,
	scale: props.data.mobileSideCardScale,
});
const mobilePositionThreeCardData = ref<CardPositionData>({
	index: 2,
	topOffset: "0",
	leftOffset: `calc(50% - 0.5 * ${props.data.mobileCardWidth})`,
	zIndex: 12,
	opacity: 1,
	scale: 1,
});
const mobilePositionFourCardData = ref<CardPositionData>({
	index: 3,
	topOffset: `calc(${props.data.mobileTopOffset})`,
	leftOffset: `calc(50% + 0.5 * ${props.data.mobileCardWidth} - ${props.data.mobileCardOverlap})`,
	zIndex: 11,
	opacity: props.data.mobileSideCardOpacity,
	scale: props.data.mobileSideCardScale,
});
const mobilePositionFiveCardData = ref<CardPositionData>({
	index: 4,
	topOffset: `calc(2 * ${props.data.mobileTopOffset})`,
	leftOffset: `calc(50% + 1.5 * ${props.data.mobileCardWidth} - 2 * ${props.data.mobileCardOverlap})`,
	zIndex: 10,
	opacity: 0,
	scale: 0,
});

const positionOneCardData = ref<CardPositionData>({
	index: 0,
	topOffset: `calc(2 * ${props.data.desktopTopOffset})`,
	leftOffset: `calc(50% - 2.5 * ${props.data.desktopCardWidth} + 2 * ${props.data.desktopCardOverlap})`,
	zIndex: 10,
	opacity: 0,
	scale: 0,
});
const positionTwoCardData = ref<CardPositionData>({
	index: 1,
	topOffset: `calc(${props.data.desktopTopOffset})`,
	leftOffset: `calc(50% - 1.5 * ${props.data.desktopCardWidth} + ${props.data.desktopCardOverlap})`,
	zIndex: 11,
	opacity: props.data.desktopSideCardOpacity,
	scale: props.data.desktopSideCardScale,
});
const positionThreeCardData = ref<CardPositionData>({
	index: 2,
	topOffset: "0",
	leftOffset: `calc(50% - 0.5 * ${props.data.desktopCardWidth})`,
	zIndex: 12,
	opacity: 1,
	scale: 1,
});
const positionFourCardData = ref<CardPositionData>({
	index: 3,
	topOffset: `calc(${props.data.desktopTopOffset})`,
	leftOffset: `calc(50% + 0.5 * ${props.data.desktopCardWidth} - ${props.data.desktopCardOverlap})`,
	zIndex: 11,
	opacity: props.data.desktopSideCardOpacity,
	scale: props.data.desktopSideCardScale,
});
const positionFiveCardData = ref<CardPositionData>({
	index: 4,
	topOffset: `calc(2 * ${props.data.desktopTopOffset})`,
	leftOffset: `calc(50% + 1.5 * ${props.data.desktopCardWidth} - 2 * ${props.data.desktopCardOverlap})`,
	zIndex: 10,
	opacity: 0,
	scale: 0,
});

const loaded = ref(false);
const paused = ref(false);
const currentIndex = ref(0);
const nextInRevewIndex = ref(2);
const cardAIndex = ref(props.data.reviews.length - 2);
const mobileCardAIndex = ref(props.data.reviews.length - 2);
const cardAPositionData = ref<CardPositionData>(positionOneCardData.value);
const mobileCardAPositionData = ref<CardPositionData>(
	mobilePositionOneCardData.value
);
const cardBIndex = ref(props.data.reviews.length - 1);
const mobileCardBIndex = ref(props.data.reviews.length - 1);
const cardBPositionData = ref<CardPositionData>(positionTwoCardData.value);
const mobileCardBPositionData = ref<CardPositionData>(
	mobilePositionTwoCardData.value
);
const cardCIndex = ref(0);
const mobileCardCIndex = ref(0);
const cardCPositionData = ref<CardPositionData>(positionThreeCardData.value);
const mobileCardCPositionData = ref<CardPositionData>(
	mobilePositionThreeCardData.value
);
const cardDIndex = ref(1);
const mobileCardDIndex = ref(1);
const cardDPositionData = ref<CardPositionData>(positionFourCardData.value);
const mobileCardDPositionData = ref<CardPositionData>(
	mobilePositionFourCardData.value
);
const cardEIndex = ref(2);
const mobileCardEIndex = ref(2);
const cardEPositionData = ref<CardPositionData>(positionFiveCardData.value);
const mobileCardEPositionData = ref<CardPositionData>(
	mobilePositionFiveCardData.value
);

const getPositionDataByIndex = (index: number) => {
	switch (index) {
		case 0:
			return positionOneCardData.value;
		case 1:
			return positionTwoCardData.value;
		case 2:
			return positionThreeCardData.value;
		case 3:
			return positionFourCardData.value;
		case 4:
			return positionFiveCardData.value;
		default:
			return positionFiveCardData.value;
	}
};

const getMobilePositionDataByIndex = (index: number) => {
	switch (index) {
		case 0:
			return mobilePositionOneCardData.value;
		case 1:
			return mobilePositionTwoCardData.value;
		case 2:
			return mobilePositionThreeCardData.value;
		case 3:
			return mobilePositionFourCardData.value;
		case 4:
			return mobilePositionFiveCardData.value;
		default:
			return mobilePositionFiveCardData.value;
	}
};

const getPreviousPositionIndex = (currentIndex: number) => {
	if (currentIndex === 4) {
		return 0;
	} else {
		return currentIndex + 1;
	}
};

const getNextPositionIndex = (currentIndex: number) => {
	if (currentIndex === 0) {
		return 4;
	} else {
		return currentIndex - 1;
	}
};

const wrapIndex = (y: number, len: number) => ((y % len) + len) % len;

const updateIndexOfLastCard = () => {
	let newIndex = 0;

	if (cardAPositionData.value.index === 4) {
		newIndex = cardAIndex.value - props.data.reviews.length;
		newIndex += 5;
		cardAIndex.value = wrapIndex(newIndex, props.data.reviews.length);

	} else if (cardBPositionData.value.index === 4) {
		newIndex = cardBIndex.value - props.data.reviews.length;
		newIndex += 5;
		cardBIndex.value = wrapIndex(newIndex, props.data.reviews.length);

	} else if (cardCPositionData.value.index === 4) {
		newIndex = cardCIndex.value - props.data.reviews.length;
		newIndex += 5;
		cardCIndex.value = wrapIndex(newIndex, props.data.reviews.length);

	} else if (cardDPositionData.value.index === 4) {
		newIndex = cardDIndex.value - props.data.reviews.length;
		newIndex += 5;
		cardDIndex.value = wrapIndex(newIndex, props.data.reviews.length);

	} else if (cardEPositionData.value.index === 4) {
		newIndex = cardEIndex.value - props.data.reviews.length;
		newIndex += 5;
		cardEIndex.value = wrapIndex(newIndex, props.data.reviews.length);
	}

	let mobileNewIndex = 0;
	if (mobileCardAPositionData.value.index === 4) {
		mobileNewIndex = mobileCardAIndex.value - props.data.reviews.length;
		mobileNewIndex += 5;
		mobileCardAIndex.value = wrapIndex(
			mobileNewIndex,
			props.data.reviews.length
		);
	} else if (mobileCardBPositionData.value.index === 4) {
		mobileNewIndex = mobileCardBIndex.value - props.data.reviews.length;
		mobileNewIndex += 5;
		mobileCardBIndex.value = wrapIndex(
			mobileNewIndex,
			props.data.reviews.length
		);
	} else if (mobileCardCPositionData.value.index === 4) {
		mobileNewIndex = mobileCardCIndex.value - props.data.reviews.length;
		mobileNewIndex += 5;
		mobileCardCIndex.value = wrapIndex(
			mobileNewIndex,
			props.data.reviews.length
		);
	} else if (mobileCardDPositionData.value.index === 4) {
		mobileNewIndex = mobileCardDIndex.value - props.data.reviews.length;
		mobileNewIndex += 5;
		mobileCardDIndex.value = wrapIndex(
			mobileNewIndex,
			props.data.reviews.length
		);
	} else if (mobileCardEPositionData.value.index === 4) {
		mobileNewIndex = mobileCardEIndex.value - props.data.reviews.length;
		mobileNewIndex += 5;
		mobileCardEIndex.value = wrapIndex(
			mobileNewIndex,
			props.data.reviews.length
		);
	}
};

const updateIndexOfFirstCard = () => {
	let newIndex = 0;
	if (cardAPositionData.value.index === 0) {
		newIndex = cardAIndex.value + props.data.reviews.length;
		newIndex -= 5;
		cardAIndex.value = wrapIndex(newIndex, props.data.reviews.length);
	} else if (cardBPositionData.value.index === 0) {
		newIndex = cardBIndex.value + props.data.reviews.length;
		newIndex -= 5;
		cardBIndex.value = wrapIndex(newIndex, props.data.reviews.length);
	} else if (cardCPositionData.value.index === 0) {
		newIndex = cardCIndex.value + props.data.reviews.length;
		newIndex -= 5;
		cardCIndex.value = wrapIndex(newIndex, props.data.reviews.length);
	} else if (cardDPositionData.value.index === 0) {
		newIndex = cardDIndex.value + props.data.reviews.length;
		newIndex -= 5;
		cardDIndex.value = wrapIndex(newIndex, props.data.reviews.length);
	} else if (cardEPositionData.value.index === 0) {
		newIndex = cardEIndex.value + props.data.reviews.length;
		newIndex -= 5;
		cardEIndex.value = wrapIndex(newIndex, props.data.reviews.length);
	}

	let mobileNewIndex = 0;
	if (mobileCardAPositionData.value.index === 0) {
		mobileNewIndex = mobileCardAIndex.value + props.data.reviews.length;
		mobileNewIndex -= 5;
		mobileCardAIndex.value = wrapIndex(mobileNewIndex, props.data.reviews.length);
	} else if (mobileCardBPositionData.value.index === 0) {
		mobileNewIndex = mobileCardBIndex.value + props.data.reviews.length;
		mobileNewIndex -= 5;
		mobileCardBIndex.value = wrapIndex(mobileNewIndex, props.data.reviews.length);
	} else if (mobileCardCPositionData.value.index === 0) {
		mobileNewIndex = mobileCardCIndex.value + props.data.reviews.length;
		mobileNewIndex -= 5;
		mobileCardCIndex.value = wrapIndex(mobileNewIndex, props.data.reviews.length);
	} else if (mobileCardDPositionData.value.index === 0) {
		mobileNewIndex = mobileCardDIndex.value + props.data.reviews.length;
		mobileNewIndex -= 5;
		mobileCardDIndex.value = wrapIndex(mobileNewIndex, props.data.reviews.length);
	} else if (mobileCardEPositionData.value.index === 0) {
		mobileNewIndex = mobileCardEIndex.value + props.data.reviews.length;
		mobileNewIndex -= 5;
		mobileCardEIndex.value = wrapIndex(mobileNewIndex, props.data.reviews.length);
	}
};


const advance = () => {
	if (nextInRevewIndex.value === props.data.reviews.length - 1) {
		nextInRevewIndex.value = 0;
	} else {
		nextInRevewIndex.value += 1;
	}

	if (currentIndex.value === props.data.reviews.length - 1) {
		currentIndex.value = 0;
	} else {
		currentIndex.value += 1;
	}

	cardAPositionData.value = getPositionDataByIndex(
		getNextPositionIndex(cardAPositionData.value.index)
	);
	cardBPositionData.value = getPositionDataByIndex(
		getNextPositionIndex(cardBPositionData.value.index)
	);
	cardCPositionData.value = getPositionDataByIndex(
		getNextPositionIndex(cardCPositionData.value.index)
	);
	cardDPositionData.value = getPositionDataByIndex(
		getNextPositionIndex(cardDPositionData.value.index)
	);
	cardEPositionData.value = getPositionDataByIndex(
		getNextPositionIndex(cardEPositionData.value.index)
	);

	mobileCardAPositionData.value = getMobilePositionDataByIndex(
		getNextPositionIndex(mobileCardAPositionData.value.index)
	);
	mobileCardBPositionData.value = getMobilePositionDataByIndex(
		getNextPositionIndex(mobileCardBPositionData.value.index)
	);
	mobileCardCPositionData.value = getMobilePositionDataByIndex(
		getNextPositionIndex(mobileCardCPositionData.value.index)
	);
	mobileCardDPositionData.value = getMobilePositionDataByIndex(
		getNextPositionIndex(mobileCardDPositionData.value.index)
	);
	mobileCardEPositionData.value = getMobilePositionDataByIndex(
		getNextPositionIndex(mobileCardEPositionData.value.index)
	);

	updateIndexOfLastCard();
};

const reverse = () => {
	if (nextInRevewIndex.value === 0) {
		nextInRevewIndex.value = props.data.reviews.length - 1;
	} else {
		nextInRevewIndex.value -= 1;
	}

	if (currentIndex.value === 0) {
		currentIndex.value = props.data.reviews.length - 1;
	} else {
		currentIndex.value -= 1;
	}

	cardAPositionData.value = getPositionDataByIndex(
		getPreviousPositionIndex(cardAPositionData.value.index)
	);
	cardBPositionData.value = getPositionDataByIndex(
		getPreviousPositionIndex(cardBPositionData.value.index)
	);
	cardCPositionData.value = getPositionDataByIndex(
		getPreviousPositionIndex(cardCPositionData.value.index)
	);
	cardDPositionData.value = getPositionDataByIndex(
		getPreviousPositionIndex(cardDPositionData.value.index)
	);
	cardEPositionData.value = getPositionDataByIndex(
		getPreviousPositionIndex(cardEPositionData.value.index)
	);

	mobileCardAPositionData.value = getMobilePositionDataByIndex(
		getPreviousPositionIndex(mobileCardAPositionData.value.index)
	);
	mobileCardBPositionData.value = getMobilePositionDataByIndex(
		getPreviousPositionIndex(mobileCardBPositionData.value.index)
	);
	mobileCardCPositionData.value = getMobilePositionDataByIndex(
		getPreviousPositionIndex(mobileCardCPositionData.value.index)
	);
	mobileCardDPositionData.value = getMobilePositionDataByIndex(
		getPreviousPositionIndex(mobileCardDPositionData.value.index)
	);
	mobileCardEPositionData.value = getMobilePositionDataByIndex(
		getPreviousPositionIndex(mobileCardEPositionData.value.index)
	);

	updateIndexOfFirstCard();
};

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const advanceToIndex = async (index: number) => {
	paused.value = true;

	if (index === currentIndex.value) return;

	transitionDuration.value = props.data.scrollSpeedMs;

	while (currentIndex.value !== index) {
		if (index < currentIndex.value) {
			reverse();
		} else {
			advance();
		}
		await sleep(props.data.scrollSpeedMs);
	}

	transitionDuration.value = props.data.transitionSpeedMs;
};

const next = async () => {
	paused.value = true;
	transitionDuration.value = props.data.scrollSpeedMs;
	advance();
	await sleep(props.data.scrollSpeedMs);
	transitionDuration.value = props.data.transitionSpeedMs;
};

const previous = async () => {
	paused.value = true;
	transitionDuration.value = props.data.scrollSpeedMs;
	reverse();
	await sleep(props.data.scrollSpeedMs);
	transitionDuration.value = props.data.transitionSpeedMs;
};

onMounted(() => {
	loaded.value = true;

	setInterval(() => {
		if (!paused.value) {
			advance();
		}
	}, props.data.autoAdvanceIntervalMs);
});
</script>

<template>
	<div
		v-if="loaded"
		class="flex flex-col"
	>
		<div
			v-if="!isLargeScreen"
			class="relative overflow-hidden w-full"
			:style="{
				height: `calc(${data.mobileCardHeight} + ${data.mobileTopOffset})`,
			}"
		>
			<ReviewCard
				:star-rating="Number(data.reviews[mobileCardAIndex].starRating)"
				:authors-name="data.reviews[mobileCardAIndex].authorsName"
				:review-text="data.reviews[mobileCardAIndex].text"
				:review-source="data.reviews[mobileCardAIndex].source"
				:card-scale="mobileCardAPositionData.scale"
				:card-opacity="mobileCardAPositionData.opacity"
				:card-z-index="mobileCardAPositionData.zIndex"
				:card-left-offset="mobileCardAPositionData.leftOffset"
				:card-top-offset="mobileCardAPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.mobileCardWidth"
				:card-height="data.mobileCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.mobileReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
			<ReviewCard
				:star-rating="Number(data.reviews[mobileCardBIndex].starRating)"
				:authors-name="data.reviews[mobileCardBIndex].authorsName"
				:review-text="data.reviews[mobileCardBIndex].text"
				:review-source="data.reviews[mobileCardBIndex].source"
				:card-scale="mobileCardBPositionData.scale"
				:card-opacity="mobileCardBPositionData.opacity"
				:card-z-index="mobileCardBPositionData.zIndex"
				:card-left-offset="mobileCardBPositionData.leftOffset"
				:card-top-offset="mobileCardBPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.mobileCardWidth"
				:card-height="data.mobileCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.mobileReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
			<ReviewCard
				:star-rating="Number(data.reviews[mobileCardCIndex].starRating)"
				:authors-name="data.reviews[mobileCardCIndex].authorsName"
				:review-text="data.reviews[mobileCardCIndex].text"
				:review-source="data.reviews[mobileCardCIndex].source"
				:card-scale="mobileCardCPositionData.scale"
				:card-opacity="mobileCardCPositionData.opacity"
				:card-z-index="mobileCardCPositionData.zIndex"
				:card-left-offset="mobileCardCPositionData.leftOffset"
				:card-top-offset="mobileCardCPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.mobileCardWidth"
				:card-height="data.mobileCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.mobileReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
			<ReviewCard
				:star-rating="Number(data.reviews[mobileCardDIndex].starRating)"
				:authors-name="data.reviews[mobileCardDIndex].authorsName"
				:review-text="data.reviews[mobileCardDIndex].text"
				:review-source="data.reviews[mobileCardDIndex].source"
				:card-scale="mobileCardDPositionData.scale"
				:card-opacity="mobileCardDPositionData.opacity"
				:card-z-index="mobileCardDPositionData.zIndex"
				:card-left-offset="mobileCardDPositionData.leftOffset"
				:card-top-offset="mobileCardDPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.mobileCardWidth"
				:card-height="data.mobileCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.mobileReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
			<ReviewCard
				:star-rating="Number(data.reviews[mobileCardEIndex].starRating)"
				:authors-name="data.reviews[mobileCardEIndex].authorsName"
				:review-text="data.reviews[mobileCardEIndex].text"
				:review-source="data.reviews[mobileCardEIndex].source"
				:card-scale="mobileCardEPositionData.scale"
				:card-opacity="mobileCardEPositionData.opacity"
				:card-z-index="mobileCardEPositionData.zIndex"
				:card-left-offset="mobileCardEPositionData.leftOffset"
				:card-top-offset="mobileCardEPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.mobileCardWidth"
				:card-height="data.mobileCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.mobileReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
		</div>
		<div
			v-else
			class="relative overflow-hidden w-full"
			:style="{
				height: `calc(${data.desktopCardHeight} + ${data.desktopTopOffset})`,
			}"
		>
			<ReviewCard
				:star-rating="Number(data.reviews[cardAIndex].starRating)"
				:authors-name="data.reviews[cardAIndex].authorsName"
				:review-text="data.reviews[cardAIndex].text"
				:review-source="data.reviews[cardAIndex].source"
				:card-scale="cardAPositionData.scale"
				:card-opacity="cardAPositionData.opacity"
				:card-z-index="cardAPositionData.zIndex"
				:card-left-offset="cardAPositionData.leftOffset"
				:card-top-offset="cardAPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.desktopCardWidth"
				:card-height="data.desktopCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.desktopReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
			<ReviewCard
				:star-rating="Number(data.reviews[cardBIndex].starRating)"
				:authors-name="data.reviews[cardBIndex].authorsName"
				:review-text="data.reviews[cardBIndex].text"
				:review-source="data.reviews[cardBIndex].source"
				:card-scale="cardBPositionData.scale"
				:card-opacity="cardBPositionData.opacity"
				:card-z-index="cardBPositionData.zIndex"
				:card-left-offset="cardBPositionData.leftOffset"
				:card-top-offset="cardBPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.desktopCardWidth"
				:card-height="data.desktopCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.desktopReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
			<ReviewCard
				:star-rating="Number(data.reviews[cardCIndex].starRating)"
				:authors-name="data.reviews[cardCIndex].authorsName"
				:review-text="data.reviews[cardCIndex].text"
				:review-source="data.reviews[cardCIndex].source"
				:card-scale="cardCPositionData.scale"
				:card-opacity="cardCPositionData.opacity"
				:card-z-index="cardCPositionData.zIndex"
				:card-left-offset="cardCPositionData.leftOffset"
				:card-top-offset="cardCPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.desktopCardWidth"
				:card-height="data.desktopCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.desktopReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
			<ReviewCard
				:star-rating="Number(data.reviews[cardDIndex].starRating)"
				:authors-name="data.reviews[cardDIndex].authorsName"
				:review-text="data.reviews[cardDIndex].text"
				:review-source="data.reviews[cardDIndex].source"
				:card-scale="cardDPositionData.scale"
				:card-opacity="cardDPositionData.opacity"
				:card-z-index="cardDPositionData.zIndex"
				:card-left-offset="cardDPositionData.leftOffset"
				:card-top-offset="cardDPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.desktopCardWidth"
				:card-height="data.desktopCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.desktopReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
			<ReviewCard
				:star-rating="Number(data.reviews[cardEIndex].starRating)"
				:authors-name="data.reviews[cardEIndex].authorsName"
				:review-text="data.reviews[cardEIndex].text"
				:review-source="data.reviews[cardEIndex].source"
				:card-scale="cardEPositionData.scale"
				:card-opacity="cardEPositionData.opacity"
				:card-z-index="cardEPositionData.zIndex"
				:card-left-offset="cardEPositionData.leftOffset"
				:card-top-offset="cardEPositionData.topOffset"
				:text-font-family="data.cardTextFontFamily"
				:card-width="data.desktopCardWidth"
				:card-height="data.desktopCardHeight"
				:transition-duration-ms="transitionDuration"
				:card-padding="data.cardPadding"
				:card-background-color="data.cardBackgroundColor"
				:card-background-color-dark-mode="data.cardBackgroundColorDark"
				:card-border-color="data.cardBorderColor"
				:card-border-color-dark-mode="data.cardBorderColorDark"
				:card-border-thickness="data.cardBorderThickness"
				:card-border-radius="data.cardBorderRadius"
				:card-text-color="data.cardTextColor"
				:card-text-color-dark-mode="data.cardTextColorDark"
				:review-text-line-clamp="data.desktopReviewTextLinesLimit"
				:authors-name-text-size="data.authorsNameFontSize"
				:review-text-size="data.reviewTextFontSize"
			/>
		</div>
		<div class="flex gap-2 justify-center py-2">
			<UIcon
				name="ooui:next-rtl"
				class="w-8 h-8 cursor-pointer mr-2 hover:scale-120 transition-all duration-300"
				@click="previous"
			/>
			<div
				v-if="isLargeScreen"
				v-for="(review, index) in data.reviews"
				:key="index"
				class="w-4 h-4 rounded-full cursor-pointer border-1 transition-all my-auto"
				:style="{
					backgroundColor: isDark
						? data.cardBackgroundColorDark
						: data.cardBackgroundColor,
					borderColor: isDark ? data.cardBorderColorDark : data.cardBorderColor,
					opacity: index === currentIndex ? 1 : 0.5,
					scale: index === currentIndex ? 1.5 : 1,
					transitionDuration: `${transitionDuration}ms`,
				}"
				@click="advanceToIndex(index)"
			></div>
			<UIcon
				name="ooui:next-ltr"
				class="w-8 h-8 cursor-pointer ml-2 hover:scale-120 transition-all duration-300"
				@click="next"
			/>
		</div>
	</div>
</template>
