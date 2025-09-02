// types/blocks/index.ts

import { z } from 'zod'

import CoastalHomePageHeroPageBlockComponent from '~/components/page-blocks/coastal-home-page-hero-page-block-component.vue'
import {
  COASTAL_HOME_PAGE_HERO_BLOCK_TYPE,
  isCoastalHomePageHeroBlock,
  type CoastalHomePageHeroBlock,
} from './coastal-home-page-hero'

import {
  isParagraphWithAccentImageBlock,
  PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE,
  type ParagraphWithAccentImageBlock,
} from './paragraph-with-accent-image'
import ParagraphWithAccentImageBlockComponent from '~/components/page-blocks/paragraph-with-accent-image-block-component.vue'

import {
  INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE,
  isInfiniteImageCarouselBlock,
  type InfiniteImageCarouselBlock,
} from './infinite-image-carousel'
import InfiniteImageCarouselPageBlockComponent from '~/components/page-blocks/infinite-image-carousel-page-block-component.vue'

import {
  isTestimonialsSectionBlock,
  TESTIMONIALS_SECTION_BLOCK_TYPE,
  type TestimonialsSectionBlock,
} from './testimonials-section'
import TestimonialsSectionPageBlockComponent from '~/components/page-blocks/testimonials-section-page-block-component.vue'

import { HEADING_BLOCK_TYPE, isHeadingBlock, type HeadingBlock } from './heading'
import HeadingBlockComponent from '~/components/page-blocks/heading-block-component.vue'

import { COLUMNS_SECTION_PAGE_BLOCK_TYPE, isColumnsSectionBlock } from './columns-section'
import ColumnsSectionPageBlockComponent from '~/components/page-blocks/columns-section-page-block-component.vue'

import {
  HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE,
  isHighlightedBlogPostsBlock,
  type HighlightedBlogPostsBlock,
} from './highlighted-blog-posts'
import HighlightedBlogPostsBlockComponent from '~/components/page-blocks/highlighted-blog-posts-block-component.vue'

/**
 * 1) Mapping object: block “type” → guard + component
 *    (public behavior unchanged)
 */
export const blockMap = {
  [COLUMNS_SECTION_PAGE_BLOCK_TYPE]: {
    guard: isColumnsSectionBlock,
    component: ColumnsSectionPageBlockComponent,
  },

  [COASTAL_HOME_PAGE_HERO_BLOCK_TYPE]: {
    guard: isCoastalHomePageHeroBlock,
    component: CoastalHomePageHeroPageBlockComponent,
  },

  [PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE]: {
    guard: isParagraphWithAccentImageBlock,
    component: ParagraphWithAccentImageBlockComponent,
  },

  [INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE]: {
    guard: isInfiniteImageCarouselBlock,
    component: InfiniteImageCarouselPageBlockComponent,
  },

  [TESTIMONIALS_SECTION_BLOCK_TYPE]: {
    guard: isTestimonialsSectionBlock,
    component: TestimonialsSectionPageBlockComponent,
  },

  [HEADING_BLOCK_TYPE]: {
    guard: isHeadingBlock,
    component: HeadingBlockComponent,
  },

  [HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE]: {
    guard: isHighlightedBlogPostsBlock,
    component: HighlightedBlogPostsBlockComponent,
  },

  // When you add “MyNewBlock”:
  //
  // [MY_NEW_BLOCK_TYPE]: {
  //   guard: isMyNewBlock,
  //   component: MyNewBlockComponent,
  // },
} as const

/**
 * 2) Discriminated union of all block interfaces.
 *    (Kept identical to your original union to avoid behavior changes.)
 */
export type PageBlock =
  | CoastalHomePageHeroBlock
  | ParagraphWithAccentImageBlock
  | InfiniteImageCarouselBlock
  | TestimonialsSectionBlock
  | HeadingBlock
  | HighlightedBlogPostsBlock
// (add “| MyNewBlock” on a new line below whenever you create a new block file)

/**
 * Core guard logic (unchanged), used by the Zod schema below.
 */
function isPageBlockCore(x: unknown): boolean {
  if (x === null || typeof x !== 'object') return false
  const t = (x as any).type as string
  const entry = (blockMap as Record<string, any>)[t]
  return !!entry && entry.guard(x)
}

/**
 * 3) Zod schema delegating to the core guard.
 *    Important: do NOT parametrize with <PageBlock> to avoid TS2456 cycles.
 */
export const PageBlockSchema = z.any().refine(isPageBlockCore, 'Invalid PageBlock')

/**
 * 4) Public runtime guard: now uses the Zod schema (same signature/behavior).
 */
export function isPageBlock(x: unknown): x is PageBlock {
  return PageBlockSchema.safeParse(x).success
}

/**
 * 5) Given a valid Block’s “type”, return its Vue component.
 *    (If someone passes an unknown type, you’ll get null.)
 */
export function resolvePageBlockComponent(type: PageBlock['type']) {
  const entry = (blockMap as Record<string, any>)[type]
  return entry ? entry.component : null
}
