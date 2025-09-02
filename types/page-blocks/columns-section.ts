import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '../custom-css-styling'
import { ColumnSectionSchema, type ColumnSection } from './columns-section-index'

export const COLUMNS_SECTION_PAGE_BLOCK_TYPE = 'columns-section' as const

/* ---------- Schemas ---------- */

export const ColumnSchema = z.object({
  width: z.string(),
  groupNumber: z.number().finite(),
  columnCustomStyling: CustomCssStylingSchema,
  columnSections: z.array(ColumnSectionSchema),
}).strict()
export type Column = z.infer<typeof ColumnSchema>

export const ColumnGroupSchema = z.object({
  groupNumber: z.number().finite(),
  columns: z.array(ColumnSchema),
}).strict()
export type ColumnGroup = z.infer<typeof ColumnGroupSchema>

export const ColumnsSectionPageBlockDataSchema = z.object({
  columnLayoutWidth: z.enum(['screen', 'standard-max-width']),
  pageBlockBackgroundOption: z.enum(['none', 'color_background', 'image_background', 'video_background']),
  pageBlockBackgroundColor: z.string().nullable(),
  pageBlockBackgroundImageUrl: z.string().nullable(),
  pageBlockBackgroundVideoUrl: z.string().nullable(),

  pageBlockPaddingTop: z.string(),
  pageBlockPaddingBottom: z.string(),
  pageBlockPaddingLeft: z.string(),
  pageBlockPaddingRight: z.string(),

  fadeTopAndBottomOfPageBlock: z.boolean(),
  pageBlockCustomStyling: CustomCssStylingSchema,

  contentAreaPaddingTop: z.string(),
  contentAreaPaddingBottom: z.string(),
  contentAreaPaddingLeft: z.string(),
  contentAreaPaddingRight: z.string(),
  contentAreaCornerRadius: z.string(),
  contentAreaBackgroundFilter: z.string(),
  contentAreaBackgroundColor: z.string().nullable(),
  contentAreaTextColor: z.string(),
  contentAreaCustomStyling: CustomCssStylingSchema,

  columnGroups: z.array(ColumnGroupSchema),
}).strict()
export type ColumnsSectionPageBlockData = z.infer<typeof ColumnsSectionPageBlockDataSchema>

export const ColumnsSectionPageBlockSchema = z.object({
  type: z.literal(COLUMNS_SECTION_PAGE_BLOCK_TYPE),
  spaceAfter: z.string(),
  data: ColumnsSectionPageBlockDataSchema,
}).strict()
export type ColumnsSectionPageBlock = z.infer<typeof ColumnsSectionPageBlockSchema>

/* ---------- Guards (preserve existing API names) ---------- */

export const isColumn = (item: unknown): item is Column =>
  ColumnSchema.safeParse(item).success

export const isColumnGroup = (item: unknown): item is ColumnGroup =>
  ColumnGroupSchema.safeParse(item).success

export const isColumnsSectionPageBlockData = (item: unknown): item is ColumnsSectionPageBlockData =>
  ColumnsSectionPageBlockDataSchema.safeParse(item).success

export const isColumnsSectionBlock = (x: unknown): x is ColumnsSectionPageBlock =>
  ColumnsSectionPageBlockSchema.safeParse(x).success

/* ---------- Assert helpers with detailed logging ---------- */

const formatIssues = (issues: z.ZodIssue[]) =>
  issues
    .map(i => {
      const path = i.path.length ? i.path.map(String).join('.') : '(root)'
      return `• ${path}: ${i.message}`
    })
    .join('\n')

function logAndThrow(name: string, value: unknown, issues: z.ZodIssue[]): never {
  const details = formatIssues(issues)
  // Log full details for debugging; keep thrown error concise but informative
  // You can tailor how much of `value` you log if it’s large/sensitive.
  // eslint-disable-next-line no-console
  console.error(`${name} validation failed:\n${details}`, { value })
  throw new Error(`${name} validation failed:\n${details}`)
}

export function assertColumn(item: unknown): asserts item is Column {
  const r = ColumnSchema.safeParse(item)
  if (!r.success) logAndThrow('Column', item, r.error.issues)
}

export function assertColumnGroup(item: unknown): asserts item is ColumnGroup {
  const r = ColumnGroupSchema.safeParse(item)
  if (!r.success) logAndThrow('ColumnGroup', item, r.error.issues)
}

export function assertColumnsSectionPageBlockData(item: unknown): asserts item is ColumnsSectionPageBlockData {
  const r = ColumnsSectionPageBlockDataSchema.safeParse(item)
  if (!r.success) logAndThrow('ColumnsSectionPageBlockData', item, r.error.issues)
}

export function assertColumnsSectionBlock(x: unknown): asserts x is ColumnsSectionPageBlock {
  const r = ColumnsSectionPageBlockSchema.safeParse(x)
  if (!r.success) logAndThrow('ColumnsSectionPageBlock', x, r.error.issues)
}
