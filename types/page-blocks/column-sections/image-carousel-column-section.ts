// types/blocks/coastal-home-page-hero.ts

import { isCustomCssStyling, type CustomCssStyling } from "~/types/custom-css-styling";
import { isImageMediaItem, type ImageMediaItem } from "~/types/image-media-item";

export const IMAGE_CAROUSEL_COLUMN_SECTION_TYPE = "image-carousel-column-section" as const;

export type ImageCarouselColumnSectionData = {
  images: ImageMediaItem[]
  showThumbnails: boolean
  marginTop: string
  marginBottom: string
  marginLeft: string
  marginRight: string
  customImageStyling: CustomCssStyling
};

export type ImageCarouselColumnSection = {
  type: typeof IMAGE_CAROUSEL_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  spaceAfter: string
  data: ImageCarouselColumnSectionData;
};

export function isImageCarouselColumnSection(x: any): x is ImageCarouselColumnSection {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === IMAGE_CAROUSEL_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    Array.isArray(x.data.images) &&
    x.data.images.every(isImageMediaItem) &&
    typeof x.data.showThumbnails === "boolean" &&
    typeof x.data.marginTop === "string" &&
    typeof x.data.marginBottom === "string" &&
    typeof x.data.marginLeft === "string" &&
    typeof x.data.marginRight === "string" &&
    isCustomCssStyling(x.data.customImageStyling)
  );
}
