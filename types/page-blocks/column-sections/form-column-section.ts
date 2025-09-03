import { z } from 'zod'
import { FormSchema } from '~/types/form-data'

export const FORM_COLUMN_SECTION_TYPE = 'form-column-section' as const

// Single button
export const FormColumnDataSchema = z.object({
  form: FormSchema,
  submitLabel: z.string(),
  intro: z.string().nullable(),
}).strict()
export type FormColumnData = z.infer<typeof FormColumnDataSchema>

// Section wrapper
export const FormColumnSectionSchema = z.object({
  type: z.literal(FORM_COLUMN_SECTION_TYPE),
  mobileOrder: z.number().nullable(),
  mobileOnly: z.boolean(),
  spaceAfter: z.string(),
  data: FormColumnDataSchema,
}).strict()
export type FormColumnSection = z.infer<typeof FormColumnSectionSchema>

/** Boolean guards (keep existing API names) */
export const isFormColumnData = (x: unknown): x is FormColumnData =>
  FormColumnDataSchema.safeParse(x).success

export const isFormColumnSection = (x: unknown): x is FormColumnSection =>
  FormColumnSectionSchema.safeParse(x).success

export function assertFormColumnSection(x: unknown): asserts x is FormColumnSection {
  const r = FormColumnSectionSchema.safeParse(x)
  if (!r.success) {
    const msg = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`FormColumnSection validation failed:\n${msg}`)
  }
}
