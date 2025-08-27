// types/blocks/coastal-home-page-hero.ts

import { isCustomCssStyling, type CustomCssStyling } from "~/types/custom-css-styling";
import { isImageMediaItem, type ImageMediaItem } from "~/types/image-media-item";

export const PARAGRAPH_WITH_FLOATED_IMAGE_COLUMN_SECTION_TYPE = "paragraph-with-floated-image-column-section" as const;

export type ParagraphWithFloatedImageColumnSectionData = {
  text: string
  image: ImageMediaItem
  disableImagePlaceholder: boolean
  imagePosition: 'left' | 'right'
  imageWidth: string
  marginTop: string
  marginBottom: string
  marginLeft: string
  marginRight: string
  imageRotation: string
  customImageStyling: CustomCssStyling
};

export type ParagraphWithFloatedImageColumnSection = {
  type: typeof PARAGRAPH_WITH_FLOATED_IMAGE_COLUMN_SECTION_TYPE;
  mobileOrder: number | null
  spaceAfter: string
  data: ParagraphWithFloatedImageColumnSectionData;
};

export function isParagraphWithFloatedImageColumnSection(x: any): x is ParagraphWithFloatedImageColumnSection {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === PARAGRAPH_WITH_FLOATED_IMAGE_COLUMN_SECTION_TYPE &&
    (x.mobileOrder === null || typeof x.mobileOrder === "number") &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    typeof x.data.text === "string" &&
    typeof x.data.image === "object" &&
    isImageMediaItem(x.data.image) &&
    (x.data.imagePosition === "left" || x.data.imagePosition === "right") &&
    typeof x.data.imageWidth === "string" &&
    typeof x.data.marginTop === "string" &&
    typeof x.data.marginBottom === "string" &&
    typeof x.data.marginLeft === "string" &&
    typeof x.data.marginRight === "string" &&
    typeof x.data.imageRotation === "string" &&
    isCustomCssStyling(x.data.customImageStyling)
  );
}
