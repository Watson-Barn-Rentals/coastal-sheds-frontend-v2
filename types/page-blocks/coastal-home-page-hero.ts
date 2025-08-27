// types/blocks/coastal-home-page-hero.ts

import { isImageMediaItem, type ImageMediaItem } from "../image-media-item";

export const COASTAL_HOME_PAGE_HERO_BLOCK_TYPE = "coastal-home-page-hero" as const;

export type CoastalHomePageHeroBlockData = {
  backgroundImage: ImageMediaItem;
  logoImage: ImageMediaItem;
  title: string;
  logoTopOffset: string;
};

export type CoastalHomePageHeroBlock = {
  type: typeof COASTAL_HOME_PAGE_HERO_BLOCK_TYPE;
  spaceAfter: string
  data: CoastalHomePageHeroBlockData;
};

export function isCoastalHomePageHeroBlock(x: any): x is CoastalHomePageHeroBlock {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === COASTAL_HOME_PAGE_HERO_BLOCK_TYPE &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    typeof x.data.backgroundImage === "object" &&
    isImageMediaItem(x.data.backgroundImage) &&
    typeof x.data.logoImage === "object" &&
    isImageMediaItem(x.data.logoImage) &&
    typeof x.data.title === "string" &&
    typeof x.data.logoTopOffset === "string"
  );
}
