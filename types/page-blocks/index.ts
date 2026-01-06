// types/blocks/index.ts

import { z } from 'zod'

import CoastalHomePageHeroPageBlockComponent from '~/components/page-blocks/coastal-home-page-hero-page-block-component.vue'
import {
  assertCoastalHomePageHeroBlock,
  COASTAL_HOME_PAGE_HERO_BLOCK_TYPE,
  type CoastalHomePageHeroBlock,
} from './coastal-home-page-hero'

import {
  assertWatsonHomePageHeroBlock,
  WATSON_HOME_PAGE_HERO_BLOCK_TYPE,
  type WatsonHomePageHeroBlock,
} from './watson-home-page-hero'

import {
  assertParagraphWithAccentImageBlock,
  PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE,
  type ParagraphWithAccentImageBlock,
} from './paragraph-with-accent-image'
import ParagraphWithAccentImageBlockComponent from '~/components/page-blocks/paragraph-with-accent-image-block-component.vue'

import {
  assertInfiniteImageCarouselBlock,
  INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE,
  type InfiniteImageCarouselBlock,
} from './infinite-image-carousel'
import InfiniteImageCarouselPageBlockComponent from '~/components/page-blocks/infinite-image-carousel-page-block-component.vue'

import {
  assertTestimonialsSectionBlock,
  TESTIMONIALS_SECTION_BLOCK_TYPE,
  type TestimonialsSectionBlock,
} from './testimonials-section'
import TestimonialsSectionPageBlockComponent from '~/components/page-blocks/testimonials-section-page-block-component.vue'

import { assertHeadingBlock, HEADING_BLOCK_TYPE, type HeadingBlock } from './heading'
import HeadingBlockComponent from '~/components/page-blocks/heading-block-component.vue'

import { assertColumnsSectionBlock, COLUMNS_SECTION_PAGE_BLOCK_TYPE } from './columns-section'
import ColumnsSectionPageBlockComponent from '~/components/page-blocks/columns-section-page-block-component.vue'

import {
  assertHighlightedBlogPostsBlock,
  HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE,
  type HighlightedBlogPostsBlock,
} from './highlighted-blog-posts'
import HighlightedBlogPostsBlockComponent from '~/components/page-blocks/highlighted-blog-posts-block-component.vue'

import { assertHighlightedFaqsBlock, HIGHLIGHTED_FAQS_BLOCK_TYPE, type HighlightedFaqsBlock } from './highlighted-faqs'
import HighlightedFaqsBlockComponent from '~/components/page-blocks/highlighted-faqs-block-component.vue'
import WatsonHomePageHeroPageBlockComponent from '~/components/page-blocks/watson-home-page-hero-page-block-component.vue'
import { assertHighlightedProductsBlock, HIGHLIGHTED_PRODUCTS_BLOCK_TYPE, type HighlightedProductsBlock } from './highlighted-products'
import HighlightedProductsBlockComponent from '~/components/page-blocks/highlighted-products-block-component.vue'
import { assertWatsonCarportsHeroBlock, WATSON_CARPORTS_HERO_BLOCK_TYPE, type WatsonCarportsHeroBlock } from './watson-carports-hero'
import WatsonCarportsHeroBlockComponent from '~/components/page-blocks/watson-carports-hero-block-component.vue'
import { assertReviewsSectionBlock, REVIEWS_SECTION_BLOCK_TYPE, type ReviewsSectionBlock } from './reviews-section'
import ReviewsSectionPageBlockComponent from '~/components/page-blocks/reviews-section-page-block-component.vue'

/**
 * 1) Mapping object: block “type” → assert-guard + component
 */
export const blockMap = {
  [COLUMNS_SECTION_PAGE_BLOCK_TYPE]: {
    guard: assertColumnsSectionBlock,
    component: ColumnsSectionPageBlockComponent,
  },

  [COASTAL_HOME_PAGE_HERO_BLOCK_TYPE]: {
    guard: assertCoastalHomePageHeroBlock,
    component: CoastalHomePageHeroPageBlockComponent,
  },

  [WATSON_HOME_PAGE_HERO_BLOCK_TYPE]: {
    guard: assertWatsonHomePageHeroBlock,
    component: WatsonHomePageHeroPageBlockComponent,
  },

  [PARAGRAPH_WITH_ACCENT_IMAGE_BLOCK_TYPE]: {
    guard: assertParagraphWithAccentImageBlock,
    component: ParagraphWithAccentImageBlockComponent,
  },

  [INFINITE_IMAGE_CAROUSEL_BLOCK_TYPE]: {
    guard: assertInfiniteImageCarouselBlock,
    component: InfiniteImageCarouselPageBlockComponent,
  },

  [TESTIMONIALS_SECTION_BLOCK_TYPE]: {
    guard: assertTestimonialsSectionBlock,
    component: TestimonialsSectionPageBlockComponent,
  },

  [HEADING_BLOCK_TYPE]: {
    guard: assertHeadingBlock,
    component: HeadingBlockComponent,
  },

  [HIGHLIGHTED_BLOG_POSTS_BLOCK_TYPE]: {
    guard: assertHighlightedBlogPostsBlock,
    component: HighlightedBlogPostsBlockComponent,
  },

  [HIGHLIGHTED_PRODUCTS_BLOCK_TYPE]: {
    guard: assertHighlightedProductsBlock,
    component: HighlightedProductsBlockComponent,
  },

  [WATSON_CARPORTS_HERO_BLOCK_TYPE]: {
    guard: assertWatsonCarportsHeroBlock,
    component: WatsonCarportsHeroBlockComponent,
  },

  [HIGHLIGHTED_FAQS_BLOCK_TYPE]: {
    guard: assertHighlightedFaqsBlock,
    component: HighlightedFaqsBlockComponent,
  },

  [REVIEWS_SECTION_BLOCK_TYPE]: {
    guard: assertReviewsSectionBlock,
    component: ReviewsSectionPageBlockComponent,
  },
} as const

/**
 * 2) Discriminated union of all block interfaces.
 */
export type PageBlock =
  | CoastalHomePageHeroBlock
  | WatsonHomePageHeroBlock
  | ParagraphWithAccentImageBlock
  | InfiniteImageCarouselBlock
  | TestimonialsSectionBlock
  | HeadingBlock
  | HighlightedBlogPostsBlock
  | HighlightedFaqsBlock
  | HighlightedProductsBlock
  | WatsonCarportsHeroBlock
  | ReviewsSectionBlock
// (add “| MyNewBlock” on a new line below whenever you create a new block file)

/**
 * Core guard logic: adapt assert-style guards to boolean.
 */
function isPageBlockCore(x: unknown): boolean {
  if (x === null || typeof x !== 'object') return false
  const t = (x as any).type as string
  const entry = (blockMap as Record<string, { guard: (u: unknown) => void }>)[t]
  if (!entry) return false
  try {
    entry.guard(x) // throws if invalid
    return true
  } catch {
    return false
  }
}

/**
 * 3) Zod schema delegating to the core guard.
 *    Important: do NOT parametrize with <PageBlock> to avoid TS2456 cycles.
 */
export const PageBlockSchema = z.any().refine(isPageBlockCore, 'Invalid PageBlock')

/**
 * 4) Public runtime guard (boolean).
 */
export function isPageBlock(x: unknown): x is PageBlock {
  return PageBlockSchema.safeParse(x).success
}

/**
 * 5) Given a valid Block’s “type”, return its Vue component.
 */
export function resolvePageBlockComponent(type: PageBlock['type']) {
  const entry = (blockMap as Record<string, any>)[type]
  return entry ? entry.component : null
}

/**
 * (Optional) Throwing validator if you want a runtime assert:
 */
// export function assertPageBlock(x: unknown): asserts x is PageBlock {
//   const r = PageBlockSchema.safeParse(x)
//   if (!r.success) throw new Error('Invalid PageBlock')
// }
