// types/forms.ts
import { z } from 'zod'

export const FormFieldTypeSchema = z.enum([
  'text', 'email', 'tel', 'textarea', 'select', 'radio', 'checkbox', 'hidden',
])

export type OptionArray = Array<{ value: string; label: string }>
export type OptionKV = Record<string, string>

const OptionsArraySchema = z.array(z.object({
  value: z.string(),
  label: z.string(),
}).strict())

const OptionsRecordSchema = z.record(z.string())

const OptionsSchema = z.union([OptionsArraySchema, OptionsRecordSchema])

export const FormFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: FormFieldTypeSchema,
  required: z.boolean(),
  placeholder: z.string().nullable(),
  helpText: z.string().nullable(),
  options: OptionsSchema,
  meta: z.record(z.unknown()),
  width: z.enum(['full', '1/2', '1/3']),
}).strict()

export const FormSchema = z.object({
  name: z.string(),
  slug: z.string(),
  netlifyName: z.string(),
  successMessage: z.string().nullable(),
  redirectUrl: z.string().nullable(),
  fields: z.array(FormFieldSchema),
}).strict()

export type FormItem = z.infer<typeof FormSchema>
export type Field = z.infer<typeof FormFieldSchema>

export const isFormItem = (x: unknown): x is FormItem =>
  FormSchema.safeParse(x).success

export function assertFormItem(x: unknown): asserts x is FormItem {
  const r = FormSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues.map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`FormItem validation failed:\n${details}`)
  }
}

export function normalizeOptions(opts: OptionArray | OptionKV): OptionArray {
  if (Array.isArray(opts)) return opts
  return Object.entries(opts || {}).map(([value, label]) => ({ value, label }))
}
