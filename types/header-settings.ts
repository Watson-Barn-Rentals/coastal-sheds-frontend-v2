export type SubMenuItem = {
  text: string
  icon: string | null
  column_number: number
  column_span: number
  url: string
}

export type MenuItem = {
  text: string
  icon: string | null
  has_children: boolean
  url: string | null
  children: SubMenuItem[]
}

export type HeaderSettings = {
  logo_url: string
  show_phone_call_to_action: boolean
  phone_call_to_action_label: string
  phone_call_to_action_phone_number: string
  show_display_mode_toggle: boolean
  menu: MenuItem[]
}

export function normalizeHeaderSettings(data: unknown): unknown {
	if (
		typeof data === 'object' &&
		data !== null &&
		Array.isArray((data as any).menu)
	) {
		for (const item of (data as any).menu) {
			if (Array.isArray(item.children)) {
				for (const child of item.children) {
					if (child && typeof child === 'object' && 'column_number' in child) {
						child.column_number = Number(child.column_number)
            child.column_span = Number(child.column_span)
					}
				}
			}
		}
	}
	return data
}


export function isHeaderSettings(data: unknown): data is HeaderSettings {
  if (typeof data !== 'object' || data === null) {
    return false
  }
  const d = data as Record<string, unknown>

  if (typeof d.logo_url !== 'string') return false
  if (typeof d.show_phone_call_to_action !== 'boolean') return false
  if (typeof d.phone_call_to_action_label !== 'string') return false
  if (typeof d.phone_call_to_action_phone_number !== 'string') return false
  if (typeof d.show_display_mode_toggle !== 'boolean') return false

  if (!Array.isArray(d.menu)) return false

  for (const itemRaw of d.menu) {
    if (typeof itemRaw !== 'object' || itemRaw === null) return false
    const item = itemRaw as Record<string, unknown>

    if (typeof item.text !== 'string') return false
    if (item.icon != null && typeof item.icon !== 'string') return false
    if (typeof item.has_children !== 'boolean') return false
    if (item.has_children) {
      // when has_children, url must be null
      if (item.url != null) return false
    } else {
      if (typeof item.url !== 'string') return false
    }

    if (!Array.isArray(item.children)) return false

    for (const childRaw of item.children) {
      if (typeof childRaw !== 'object' || childRaw === null) return false
      const child = childRaw as Record<string, unknown>

      if (typeof child.text !== 'string') return false
      if (child.icon != null && typeof child.icon !== 'string') return false
      if (typeof child.column_number !== 'number') return false
      if (typeof child.column_span !== 'number') return false
      if (typeof child.url !== 'string') return false
    }
  }

  return true
}
