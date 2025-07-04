// types/blocks/paragraph-with-accent-image.ts

import { isImageMediaItem, type ImageMediaItem } from "../image-media-item";

export const PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE = "paragraph-with-accent-image" as const;

export type ParagraphWithAccentImageBlockData = {
  title: string;
  text: string;
  image: ImageMediaItem;
  disableImagePlaceholder: boolean;
  alignment: "left" | "right";
  imageWidth: string;
  horizontalImageOffset: string;
  verticalImageOffset: string;
  imageRotation: string;
  imagePadding: string;
  imageStyling: string;
};

export type ParagraphWithAccentImageBlock = {
  type: typeof PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE;
  data: ParagraphWithAccentImageBlockData;
};

export function isParagraphWithAccentImageBlock(x: any): x is ParagraphWithAccentImageBlock {
  return (
    x !== null &&
    typeof x === "object" &&
    x.type === PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE &&
    typeof x.data === "object" &&
    typeof x.data.title === "string" &&
    typeof x.data.text === "string" &&
    typeof x.data.image === "object" &&
    isImageMediaItem(x.data.image) &&
    typeof x.data.disableImagePlaceholder === "boolean" &&
    (x.data.alignment === "left" || x.data.alignment === "right") &&
    typeof x.data.imageWidth === "string" &&
    typeof x.data.horizontalImageOffset === "string" &&
    typeof x.data.verticalImageOffset === "string" &&
    typeof x.data.imageRotation === "string" &&
    typeof x.data.imagePadding === "string" &&
    typeof x.data.imageStyling === "string"
  );
}
