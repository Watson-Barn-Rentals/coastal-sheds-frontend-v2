<script setup lang="ts">
import { ScriptYouTubePlayer } from "#components";
import { submitTrackingEvent } from "~/services/submit-tracking-event";
import type { YoutubeEmbedColumnSectionData } from "~/types/page-blocks/column-sections/youtube-embed-column-section";

const props = defineProps<{
	data: YoutubeEmbedColumnSectionData;
}>();

type PlayerStateEvent = { data: number };

function isPlayerStateEvent(e: unknown): e is PlayerStateEvent {
	return (
		typeof e === "object" &&
		e !== null &&
		"data" in e &&
		typeof (e as any).data === "number"
	);
}

const PLAYING = 1 as const;

const handleStateChange = (event: unknown) => {
	if (isPlayerStateEvent(event) && event.data === PLAYING) {
		submitTrackingEvent(props.data.trackingEventName);
	}
};
</script>

<template>
	<div
		:style="{
			marginTop: props.data.marginTop,
			marginBottom: props.data.marginBottom,
			marginLeft: props.data.marginLeft,
			marginRight: props.data.marginRight,
			aspectRatio: props.data.aspectRatio,
		}"
	>
    <ScriptYouTubePlayer
      class="absolute inset-0 w-full h-full"
      :video-id="props.data.youtubeVideoId"
      @state-change="handleStateChange"
    >
      <template #placeholder="{ placeholder }">
        <img
          class="absolute inset-0 w-full h-full object-cover block"
          :src="placeholder"
          alt="Video Placeholder"
        />
      </template>

      <template #awaitingLoad>
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[48px] w-[68px]">
          <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
            <path
              d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
              fill="#f00"
            />
            <path d="M 45,24 27,14 27,34" fill="#fff" />
          </svg>
        </div>
      </template>
    </ScriptYouTubePlayer>
	</div>
</template>
