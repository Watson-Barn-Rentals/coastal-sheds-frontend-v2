// types/blocks/paragraph-with-accent-image.ts

import { isImageMediaItem, type ImageMediaItem } from "../image-media-item";

export const INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE = "infinite-image-carousel" as const;

export type InfiniteImageCarouselBlockData = {
  images: ImageMediaItem[];
  loopTimeInSeconds: number;
  maxImageRotation: string;
};

export type InfiniteImageCarouselBlock = {
  type: typeof INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE;
  spaceAfter: string
  data: InfiniteImageCarouselBlockData;
};

export function isInfiniteImageCarouselBlock(x: any): x is InfiniteImageCarouselBlock {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    Array.isArray(x.data.images) &&
    x.data.images.every(isImageMediaItem) &&
    typeof x.data.loopTimeInSeconds === "number" &&
    typeof x.data.maxImageRotation === "string"
  );
}
