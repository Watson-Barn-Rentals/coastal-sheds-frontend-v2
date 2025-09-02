import { z } from 'zod'
import { CustomCssStylingSchema, type CustomCssStyling } from '~/types/custom-css-styling'

export const LINK_BUTTONS_COLUMN_SECTION_TYPE = 'link-buttons-column-section' as const

// Single button
export const LinkButtonDataSchema = z.object({
  destination: z.string(), // keep as string since it may be a route, not a full URL
  label: z.string(),
  iconPresets: z.enum(['custom-icon', 'animated-right-side-arrow']),
  iconName: z.string().nullable(),
  customIconStyling: CustomCssStylingSchema,
  buttonStyling: z.string(),
  trackingEventName: z.string(),
}).strict()
export type LinkButtonData = z.infer<typeof LinkButtonDataSchema>

// Data for the whole buttons section
export const LinkButtonsColumnSectionDataSchema = z.object({
  buttonSpacing: z.enum(['center', 'space-between', 'space-around']),
  buttons: z.array(LinkButtonDataSchema),
}).strict()
export type LinkButtonsColumnSectionData = z.infer<typeof LinkButtonsColumnSectionDataSchema>

// Section wrapper
export const LinkButtonsColumnSectionSchema = z.object({
  type: z.literal(LINK_BUTTONS_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: LinkButtonsColumnSectionDataSchema,
}).strict()
export type LinkButtonsColumnSection = z.infer<typeof LinkButtonsColumnSectionSchema>

/** Boolean guards (keep existing API names) */
export const isLinkButtonData = (x: unknown): x is LinkButtonData =>
  LinkButtonDataSchema.safeParse(x).success

export const isLinkButtonsColumnSection = (x: unknown): x is LinkButtonsColumnSection =>
  LinkButtonsColumnSectionSchema.safeParse(x).success

/** Optional: assertion helpers with readable errors */
export function assertLinkButtonData(x: unknown): asserts x is LinkButtonData {
  const r = LinkButtonDataSchema.safeParse(x)
  if (!r.success) {
    const msg = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`LinkButtonData validation failed:\n${msg}`)
  }
}
export function assertLinkButtonsColumnSection(x: unknown): asserts x is LinkButtonsColumnSection {
  const r = LinkButtonsColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const msg = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`LinkButtonsColumnSection validation failed:\n${msg}`)
  }
}
