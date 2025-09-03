// types/employee-item.ts
import { z } from 'zod'
import { ImageMediaItemSchema, type ImageMediaItem } from './image-media-item'

export const EmployeeItemSchema = z.object({
  profilePicture: ImageMediaItemSchema,
  name: z.string(),
  title: z.string(),
  bio: z.string().nullable(),
}).strict()

export type EmployeeItem = z.infer<typeof EmployeeItemSchema>

// Boolean guard (same API name)
export const isEmployeeItem = (x: unknown): x is EmployeeItem =>
  EmployeeItemSchema.safeParse(x).success

// Optional: assertion with readable errors
export function assertEmployeeItem(x: unknown): asserts x is EmployeeItem {
  const r = EmployeeItemSchema.safeParse(x)
  if (!r.success) {
    const details = r.error.issues
      .map(i => `• ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`EmployeeItem validation failed:\n${details}`)
  }
}
