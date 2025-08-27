// types/blocks/index.ts

import HeadingColumnSectionComponent from "~/components/page-blocks/column-sections/heading-column-section-component.vue";
import { HEADING_COLUMN_SECTION_TYPE, isHeadingColumnSection, type HeadingColumnSection } from "./column-sections/heading-column-section";
import { isParagraphColumnSection, PARAGRAPH_COLUMN_SECTION_TYPE, type ParagraphColumnSection } from "./column-sections/paragraph-column-section";
import ParagraphColumnSectionComponent from "~/components/page-blocks/column-sections/paragraph-column-section-component.vue";
import { IMAGE_COLUMN_SECTION_TYPE, isImageColumnSection, type ImageColumnSection } from "./column-sections/image-column-section";
import ImageColumnSectionComponent from "~/components/page-blocks/column-sections/image-column-section-component.vue";
import { isLinkButtonsColumnSection, LINK_BUTTONS_COLUMN_SECTION_TYPE, type LinkButtonsColumnSection } from "./column-sections/link-buttons-column-section";
import LinkButtonsColumnSectionComponent from "~/components/page-blocks/column-sections/link-buttons-column-section-component.vue";
import { isSpacerColumnSection, SPACER_COLUMN_SECTION_TYPE, type SpacerColumnSection } from "./column-sections/spacer-column-section";
import SpacerColumnSectionComponent from "~/components/page-blocks/column-sections/spacer-column-section-component.vue";
import { isYoutubeEmbedColumnSection, YOUTUBE_EMBED_COLUMN_SECTION_TYPE, type YoutubeEmbedColumnSection } from "./column-sections/youtube-embed-column-section";
import YoutubeEmbedColumnSectionComponent from "~/components/page-blocks/column-sections/youtube-embed-column-section-component.vue";
import { isParagraphWithFloatedImageColumnSection, PARAGRAPH_WITH_FLOATED_IMAGE_COLUMN_SECTION_TYPE, type ParagraphWithFloatedImageColumnSection } from "./column-sections/paragraph-with-floated-image-column-section";
import ParagraphWithFloatedImageColumnSectionComponent from "~/components/page-blocks/column-sections/paragraph-with-floated-image-column-section-component.vue";
import { IMAGE_CAROUSEL_COLUMN_SECTION_TYPE, isImageCarouselColumnSection, type ImageCarouselColumnSection } from "./column-sections/image-carousel-column-section";
import ImageCarouselColumnSectionComponent from "~/components/page-blocks/column-sections/image-carousel-column-section-component.vue";


/**
 * 1) Build a mapping object: each key is the “type” string,
 *    and each value tells us:
 *      • guard:  which function narrows to the correct TS interface
 *      • component: the actual imported Vue component
 */
export const blockMap = {
  [HEADING_COLUMN_SECTION_TYPE]: {
    guard: isHeadingColumnSection,
    component: HeadingColumnSectionComponent,
  },
  [PARAGRAPH_COLUMN_SECTION_TYPE]: {
    guard: isParagraphColumnSection,
    component: ParagraphColumnSectionComponent,
  },
  [IMAGE_COLUMN_SECTION_TYPE]: {
    guard: isImageColumnSection,
    component: ImageColumnSectionComponent,
  },
  [LINK_BUTTONS_COLUMN_SECTION_TYPE]: {
    guard: isLinkButtonsColumnSection,
    component: LinkButtonsColumnSectionComponent,
  },
  [SPACER_COLUMN_SECTION_TYPE]: {
    guard: isSpacerColumnSection,
    component: SpacerColumnSectionComponent,
  },
  [YOUTUBE_EMBED_COLUMN_SECTION_TYPE]: {
    guard: isYoutubeEmbedColumnSection,
    component: YoutubeEmbedColumnSectionComponent,
  },
  [PARAGRAPH_WITH_FLOATED_IMAGE_COLUMN_SECTION_TYPE]: {
    guard: isParagraphWithFloatedImageColumnSection,
    component: ParagraphWithFloatedImageColumnSectionComponent,
  },
  [IMAGE_CAROUSEL_COLUMN_SECTION_TYPE]: {
    guard: isImageCarouselColumnSection,
    component: ImageCarouselColumnSectionComponent,
  },

  // When you add “MyNewColumnSection”:
  //
  // [MY_NEW_COLUMN_SECTION_TYPE]: {
  //   guard: isMyNewColumnSection,
  //   component: MyNewColumnSectionComponent,
  // },
} as const;

/**
 * 2) Export a discriminated union of all column section interfaces.
 */
export type ColumnSection = 
  | HeadingColumnSection
  | ParagraphColumnSection
  | ImageColumnSection
  | LinkButtonsColumnSection
  | SpacerColumnSection
  | YoutubeEmbedColumnSection
  | ParagraphWithFloatedImageColumnSection
  | ImageCarouselColumnSection
// (add “| MyNewColumnSection” on a new line below whenever you create a new column section file)

/**
 * 3) Runtime guard: checks x.type and calls the matching guard.
 *    After this returns true, TS knows x is “ColumnSection”.
 */
export function isColumnSection(x: any): x is ColumnSection {
  if (x === null || typeof x !== "object") return false;
  const t = (x as any).type as string;
  const entry = (blockMap as Record<string, any>)[t];
  if (!entry) return false;
  return entry.guard(x);
}

/**
 * 4) Given a valid Column Section’s “type”, return its Vue component.
 *    (If someone passes an unknown type, you’ll get undefined.)
 */
export function resolveColumnSectionComponent(type: ColumnSection["type"]) {
  const entry = (blockMap as Record<string, any>)[type];
  return entry ? entry.component : null;
}
