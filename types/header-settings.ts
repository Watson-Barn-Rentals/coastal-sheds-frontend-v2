import { z } from 'zod'

/* ---------- Sub-menu item ---------- */
export const SubMenuItemSchema = z.object({
  text: z.string(),
  icon: z.string().nullable(),
  column_number: z.coerce.number().int(), // coerce "3" -> 3
  column_span: z.coerce.number().int(),
  mobile_row_number: z.coerce.number().int().nullable(),
  url: z.string(),
}).strict()

export type SubMenuItem = z.infer<typeof SubMenuItemSchema>

/* ---------- Menu item (conditional url based on has_children) ---------- */
const MenuItemBase = z.object({
  text: z.string(),
  icon: z.string().nullable(),
  children: z.array(SubMenuItemSchema),
})

export const MenuItemSchema = z.discriminatedUnion('has_children', [
  MenuItemBase.extend({
    has_children: z.literal(true),
    url: z.null(),
  }),
  MenuItemBase.extend({
    has_children: z.literal(false),
    url: z.string(),
  }),
])

export type MenuItem = z.infer<typeof MenuItemSchema>

/* ---------- Header settings ---------- */
export const HeaderSettingsSchema = z.object({
  logo_url: z.string(),
  show_phone_call_to_action: z.boolean(),
  phone_call_to_action_label: z.string(),
  phone_call_to_action_phone_number: z.string(),
  show_display_mode_toggle: z.boolean(),
  header_preset: z.enum(['floating-rounded', 'standard-full-width']),
  menu: z.array(MenuItemSchema),
}).strict()

export type HeaderSettings = z.infer<typeof HeaderSettingsSchema>

/* ---------- Normalizer (uses coercion) ---------- */
export function normalizeHeaderSettings(data: unknown): unknown {
  const r = HeaderSettingsSchema.safeParse(data)
  return r.success ? r.data : data
}

/* ---------- Boolean guard (same API as before) ---------- */
export function isHeaderSettings(data: unknown): data is HeaderSettings {
  return HeaderSettingsSchema.safeParse(data).success
}

// Optional: assertion with readable error details
export function assertHeaderSettings(data: unknown): asserts data is HeaderSettings {
  const r = HeaderSettingsSchema.safeParse(data)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`HeaderSettings validation failed:\n${details}`)
  }
}
