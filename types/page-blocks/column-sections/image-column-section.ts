// types/blocks/coastal-home-page-hero.ts

import { isCustomCssStyling, type CustomCssStyling } from "~/types/custom-css-styling";
import { isImageMediaItem, type ImageMediaItem } from "~/types/image-media-item";

export const IMAGE_COLUMN_SECTION_TYPE = "image-column-section" as const;

export type ImageColumnSectionData = {
  image: ImageMediaItem
  disableImagePlaceholder: boolean
  marginTop: string
  marginBottom: string
  marginLeft: string
  marginRight: string
  imageRotation: string
  customImageStyling: CustomCssStyling
};

export type ImageColumnSection = {
  type: typeof IMAGE_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  spaceAfter: string
  data: ImageColumnSectionData;
};

export function isImageColumnSection(x: any): x is ImageColumnSection {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === IMAGE_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    isImageMediaItem(x.data.image) &&
    typeof x.data.disableImagePlaceholder === "boolean" &&
    typeof x.data.marginTop === "string" &&
    typeof x.data.marginBottom === "string" &&
    typeof x.data.marginLeft === "string" &&
    typeof x.data.marginRight === "string" &&
    typeof x.data.imageRotation === "string" &&
    isCustomCssStyling(x.data.customImageStyling)
  );
}
