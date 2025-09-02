import { z } from 'zod'

import HeadingColumnSectionComponent from '~/components/page-blocks/column-sections/heading-column-section-component.vue'
import {
  HEADING_COLUMN_SECTION_TYPE,
  isHeadingColumnSection,
  HeadingColumnSectionSchema,
} from './column-sections/heading-column-section'

import {
  isParagraphColumnSection,
  PARAGRAPH_COLUMN_SECTION_TYPE,
  ParagraphColumnSectionSchema,
} from './column-sections/paragraph-column-section'
import ParagraphColumnSectionComponent from '~/components/page-blocks/column-sections/paragraph-column-section-component.vue'

import {
  IMAGE_COLUMN_SECTION_TYPE,
  isImageColumnSection,
  ImageColumnSectionSchema,
} from './column-sections/image-column-section'
import ImageColumnSectionComponent from '~/components/page-blocks/column-sections/image-column-section-component.vue'

import {
  isLinkButtonsColumnSection,
  LINK_BUTTONS_COLUMN_SECTION_TYPE,
  LinkButtonsColumnSectionSchema,
} from './column-sections/link-buttons-column-section'
import LinkButtonsColumnSectionComponent from '~/components/page-blocks/column-sections/link-buttons-column-section-component.vue'

import {
  isSpacerColumnSection,
  SPACER_COLUMN_SECTION_TYPE,
  SpacerColumnSectionSchema,
} from './column-sections/spacer-column-section'
import SpacerColumnSectionComponent from '~/components/page-blocks/column-sections/spacer-column-section-component.vue'

import {
  isYoutubeEmbedColumnSection,
  YOUTUBE_EMBED_COLUMN_SECTION_TYPE,
  YoutubeEmbedColumnSectionSchema,
} from './column-sections/youtube-embed-column-section'
import YoutubeEmbedColumnSectionComponent from '~/components/page-blocks/column-sections/youtube-embed-column-section-component.vue'

import {
  isParagraphWithFloatedImageColumnSection,
  PARAGRAPH_WITH_FLOATED_IMAGE_COLUMN_SECTION_TYPE,
  ParagraphWithFloatedImageColumnSectionSchema,
} from './column-sections/paragraph-with-floated-image-column-section'
import ParagraphWithFloatedImageColumnSectionComponent from '~/components/page-blocks/column-sections/paragraph-with-floated-image-column-section-component.vue'

import {
  IMAGE_CAROUSEL_COLUMN_SECTION_TYPE,
  isImageCarouselColumnSection,
  ImageCarouselColumnSectionSchema,
} from './column-sections/image-carousel-column-section'
import ImageCarouselColumnSectionComponent from '~/components/page-blocks/column-sections/image-carousel-column-section-component.vue'

/**
 * 1) Mapping object from “type” → guard + component
 *    (unchanged public API)
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
  // Add new sections here as before.
} as const

/**
 * 2) Zod discriminated union for all Column Sections.
 *    This gives you a single runtime schema for validation anywhere.
 */
export const ColumnSectionSchema = z.discriminatedUnion('type', [
  HeadingColumnSectionSchema,
  ParagraphColumnSectionSchema,
  ImageColumnSectionSchema,
  LinkButtonsColumnSectionSchema,
  SpacerColumnSectionSchema,
  YoutubeEmbedColumnSectionSchema,
  ParagraphWithFloatedImageColumnSectionSchema,
  ImageCarouselColumnSectionSchema,
])

/**
 * 3) Export the union type inferred from the schema.
 *    (Public type name stays the same.)
 */
export type ColumnSection = z.infer<typeof ColumnSectionSchema>

/**
 * 4) Runtime guard: now uses the Zod union schema.
 *    Signature and behavior remain the same (boolean return).
 */
export function isColumnSection(x: unknown): x is ColumnSection {
  return ColumnSectionSchema.safeParse(x).success
}

/**
 * 5) Resolve component by type (unchanged).
 */
export function resolveColumnSectionComponent(type: ColumnSection['type']) {
  const entry = (blockMap as Record<string, any>)[type]
  return entry ? entry.component : null
}
