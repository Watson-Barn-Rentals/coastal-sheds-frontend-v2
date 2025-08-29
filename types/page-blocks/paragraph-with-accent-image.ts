// types/blocks/paragraph-with-accent-image.ts

import { isCustomCssStyling, type CustomCssStyling } from "../custom-css-styling";
import { isImageMediaItem, type ImageMediaItem } from "../image-media-item";

export const PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE = "paragraph-with-accent-image" as const;

export type ParagraphWithAccentImageBlockData = {
  title: string | null;
  titleTextSize: string;
  titleFont: string;
  titleTextColor: string;
  titleCustomStyling: CustomCssStyling;
  text: string;
  bodyTextSize: string;
  bodyFont: string;
  bodyTextColor: string;
  bodyCustomStyling: CustomCssStyling;
  image: ImageMediaItem;
  disableImagePlaceholder: boolean;
  alignment: "left" | "right";
  imageWidth: string;
  horizontalImageOffset: string;
  verticalImageOffset: string;
  imageRotation: string;
  imagePadding: string;
  customImageStyling: CustomCssStyling;
};

export type ParagraphWithAccentImageBlock = {
  type: typeof PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE;
  spaceAfter: string
  data: ParagraphWithAccentImageBlockData;
};

export function isParagraphWithAccentImageBlock(x: any): x is ParagraphWithAccentImageBlock {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE &&
    typeof x.spaceAfter === "string" &&
    typeof x.data === "object" &&
    (typeof x.data.title === "string" || x.data.title === null) &&
    typeof x.data.titleTextSize === "string" &&
    typeof x.data.titleFont === "string" &&
    typeof x.data.titleTextColor === "string" &&
    isCustomCssStyling(x.data.titleCustomStyling) &&
    typeof x.data.text === "string" &&
    typeof x.data.bodyTextSize === "string" &&
    typeof x.data.bodyFont === "string" &&
    typeof x.data.bodyTextColor === "string" &&
    isCustomCssStyling(x.data.bodyCustomStyling) &&
    typeof x.data.image === "object" &&
    isImageMediaItem(x.data.image) &&
    typeof x.data.disableImagePlaceholder === "boolean" &&
    (x.data.alignment === "left" || x.data.alignment === "right") &&
    typeof x.data.imageWidth === "string" &&
    typeof x.data.horizontalImageOffset === "string" &&
    typeof x.data.verticalImageOffset === "string" &&
    typeof x.data.imageRotation === "string" &&
    typeof x.data.imagePadding === "string" &&
    isCustomCssStyling(x.data.customImageStyling)
  );
}
