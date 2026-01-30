import { assertInventoryItem, type InventoryItem } from '~/types/inventory-item'

type CursorMeta = {
  next_cursor: string | null
  prev_cursor: string | null
}

type CursorResponse = {
  data: unknown
  meta?: CursorMeta
  links?: { next?: string | null; prev?: string | null }
}

export const getInventoryPaginatedList = async (perPage: number, cursor: string | null) => {
  const config = useRuntimeConfig()

  const res = await $fetch<CursorResponse>(
    `${config.public.apiRootUrl}/api/list-inventory`,
    {
      query: {
        per_page: perPage,
        cursor: cursor,
      },
    }
  )

  const data = (res as any).data

  if (!Array.isArray(data)) {
    console.error('[getInventoryPaginatedList] Expected array, received:', typeof data, res)
    throw new Error('Invalid response from API: data is not an array')
  }

  for (let i = 0; i < data.length; i++) {
    try {
      assertInventoryItem(data[i])
    } catch (e: any) {
      const serial = (data[i] as any)?.serialNumber ?? 'unknown'
      console.error(
        `[getInventoryPaginatedList] Validation failed for item at index ${i} (serial: ${serial}):`,
        e?.message ?? e,
        { item: data[i] }
      )
      throw e
    }
  }

  // Prefer meta.next_cursor; fallback to parsing links.next
  let nextCursor = res.meta?.next_cursor ?? null
  if (!nextCursor && res.links?.next) {
    try {
      const u = new URL(res.links.next)
      nextCursor = u.searchParams.get('cursor')
    } catch {}
  }

  return {
    items: data as InventoryItem[],
    nextCursor,
  }
}
