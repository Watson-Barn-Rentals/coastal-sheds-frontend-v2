// types/blocks/coastal-home-page-hero.ts

import { isCustomCssStyling, type CustomCssStyling } from "~/types/custom-css-styling";

export const YOUTUBE_EMBED_COLUMN_SECTION_TYPE = "youtube-embed-column-section" as const;

export type YoutubeEmbedColumnSectionData = {
  youtubeVideoId: string
  marginTop: string
  marginBottom: string
  marginLeft: string
  marginRight: string
  trackingEventName: string
};

export type YoutubeEmbedColumnSection = {
  type: typeof YOUTUBE_EMBED_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  mobileOnly: boolean
  spaceAfter: string
  data: YoutubeEmbedColumnSectionData;
};

export function isYoutubeEmbedColumnSection(x: any): x is YoutubeEmbedColumnSection {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === YOUTUBE_EMBED_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.mobileOnly === "boolean" &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    typeof x.data.youtubeVideoId === "string" &&
    typeof x.data.marginTop === "string" &&
    typeof x.data.marginBottom === "string" &&
    typeof x.data.marginLeft === "string" &&
    typeof x.data.marginRight === "string" &&
    typeof x.data.trackingEventName === "string"
  );
}
