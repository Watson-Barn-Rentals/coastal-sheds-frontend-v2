// ~/composables/useInventoryFilters.ts
import { useRoute, useRouter } from '#imports'
import { useDebounceFn } from '@vueuse/core'
import { computed, reactive, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { InventoryItem } from '~/types/inventory-item'

export type InventoryFiltersState = {
  searchQuery: string
  productCategorySlug: string | null
  productLineSlug: string | null
  productSlug: string | null
  size: string | null
  minPrice: number | null
  maxPrice: number | null
  discounted: boolean | null
  condition: 'new' | 'used' | null
  locationSlug: string | null
  regionSlug: string | null
  highlightedLabel: string | null
}

export type InventorySortMode =
  | 'default'
  | 'price-ascending'
  | 'price-descending'
  | 'product-name'
  | 'size-ascending'
  | 'size-descending'
  | 'distance-from-user'

type UrlQuery = Record<string, string | undefined>
type Option = { value: string; label: string }

// --- helpers ------------------------------------------------------------
function toLabelFromSlug(value: string): string {
  const s = decodeURIComponent(value).replace(/[-_]+/g, ' ').trim()
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}
function withSelected(list: Option[], selected?: string | null): Option[] {
  if (!selected) return list
  if (list.some(o => o.value === selected)) return list
  return [...list, { value: selected, label: toLabelFromSlug(selected) }]
}
// -----------------------------------------------------------------------

function stateToQuery(state: InventoryFiltersState): UrlQuery {
  return {
    search: state.searchQuery || undefined,
    productCategory: state.productCategorySlug || undefined,
    productLine: state.productLineSlug || undefined,
    product: state.productSlug || undefined,
    size: state.size || undefined,
    minPrice: state.minPrice == null ? undefined : String(state.minPrice),
    maxPrice: state.maxPrice == null ? undefined : String(state.maxPrice),
    discounted: state.discounted === null ? undefined : state.discounted ? '1' : '0',
    condition: state.condition ?? undefined,
    location: state.locationSlug || undefined,
    region: state.regionSlug || undefined,
    tag: state.highlightedLabel || undefined,
  }
}

function queryToState(query: UrlQuery): InventoryFiltersState {
  return {
    searchQuery: query.search ?? '',
    productCategorySlug: query.productCategory ?? null,
    productLineSlug: query.productLine ?? null,
    productSlug: query.product ?? null,
    size: query.size ?? null,
    minPrice: query.minPrice != null ? Number(query.minPrice) : null,
    maxPrice: query.maxPrice != null ? Number(query.maxPrice) : null,
    discounted: query.discounted == null ? null : query.discounted === '1',
    condition: query.condition === 'new' || query.condition === 'used' ? query.condition : null,
    locationSlug: query.location ?? null,
    regionSlug: query.region ?? null,
    highlightedLabel: query.tag ?? null,
  }
}

function parseSizeToArea(size: string | null | undefined): number {
  if (!size) return NaN
  const m = size.match(/(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)/)
  if (!m) return NaN
  const w = Number(m[1]), l = Number(m[2])
  return Number.isFinite(w) && Number.isFinite(l) ? w * l : NaN
}

function parseSortMode(q: string | undefined): InventorySortMode {
  const allowed: InventorySortMode[] = [
    'default','price-ascending','price-descending','product-name','size-ascending','size-descending','distance-from-user'
  ]
  return allowed.includes(q as InventorySortMode) ? (q as InventorySortMode) : 'default'
}

export function useInventoryFilters(
  source: Ref<InventoryItem[] | null>,
  opts?: { distanceMetersByLocationSlug?: Ref<Record<string, number | null>> }
): {
  state: InventoryFiltersState
  filtered: ComputedRef<InventoryItem[]>
  sorted: ComputedRef<InventoryItem[]>
  sortMode: Ref<InventorySortMode>
  productCategoryOptions: ComputedRef<Option[]>
  productLineOptions: ComputedRef<Option[]>
  productOptions: ComputedRef<Option[]>
  sizeOptions: ComputedRef<Option[]>
  locationOptions: ComputedRef<Option[]>
  regionOptions: ComputedRef<Option[]>
  tagOptions: ComputedRef<Option[]>
  chips: ComputedRef<Array<{ key: keyof InventoryFiltersState | 'minPrice' | 'maxPrice'; label: string }>>
  clearChip: (key: keyof InventoryFiltersState | 'minPrice' | 'maxPrice') => void
  reset: () => void
} {
  const route = useRoute()
  const router = useRouter()

  const state = reactive<InventoryFiltersState>(queryToState(route.query as UrlQuery))
  const sortMode = ref<InventorySortMode>(parseSortMode(route.query.sort as string | undefined))

  watch(
    () => route.query,
    (query) => {
      Object.assign(state, queryToState(query as UrlQuery))
      sortMode.value = parseSortMode((query as UrlQuery).sort)
    }
  )

  const pushQueryToUrl = useDebounceFn(() => {
    const next: Record<string, any> = { ...route.query, ...stateToQuery(state), sort: sortMode.value }
    for (const key of Object.keys(next)) if (next[key] === undefined) delete next[key]
    router.replace({ query: next })
  }, 250)

  watch(state, pushQueryToUrl, { deep: true })
  watch(sortMode, pushQueryToUrl)

  // ---------- Option builders ----------
  const productCategoryOptions = computed<Option[]>(() => {
    const map = new Map<string, string>()
    for (const item of (source.value ?? [])) {
      const slug = (item as any).product?.product_category_slug
      const title = (item as any).product?.product_category_title
      if (slug && title) map.set(slug, title)
    }
    const list = [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }))
    return withSelected(list, state.productCategorySlug)
  })

  const productLineOptions = computed<Option[]>(() => {
    const map = new Map<string, string>()
    for (const item of (source.value ?? [])) {
      const slug = item.product?.product_line_slug
      const title = item.product?.product_line_title
      if (slug && title) map.set(slug, title)
    }
    const list = [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }))
    return withSelected(list, state.productLineSlug)
  })

  const productOptions = computed<Option[]>(() => {
    const map = new Map<string, string>()
    for (const item of (source.value ?? [])) {
      const slug = item.product?.slug
      const title = item.product?.title
      if (slug && title) map.set(slug, title)
    }
    const list = [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }))
    return withSelected(list, state.productSlug)
  })

  const sizeOptions = computed<Option[]>(() => {
    const set = new Set<string>()
    for (const item of (source.value ?? [])) if (item.size) set.add(item.size)
    const list = [...set].sort().map(v => ({ value: v, label: v }))
    return withSelected(list, state.size)
  })

  const locationOptions = computed<Option[]>(() => {
    const map = new Map<string, string>()
    for (const item of (source.value ?? [])) {
      const slug = item.location?.slug
      const title = item.location?.title
      if (slug && title) map.set(slug, title)
    }
    const list = [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }))
    return withSelected(list, state.locationSlug)
  })

  const tagOptions = computed<Option[]>(() => {
    const set = new Set<string>()
    for (const item of (source.value ?? [])) {
      const tag = item.highlightedLabel?.trim()
      if (tag) set.add(tag)
    }
    const list = [...set].sort((a, b) => a.localeCompare(b))
      .map(v => ({ value: v, label: v }))
    return withSelected(list, state.highlightedLabel)
  })

  const regionOptions = computed<Option[]>(() => {
    const map = new Map<string, string>()
    for (const item of (source.value ?? [])) {
      const regions = item.location?.regions ?? []
      for (const region of regions) {
        const slug = region?.slug
        const title = region?.title
        if (slug && title) map.set(slug, title)
      }
    }
    const list = [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }))
    return withSelected(list, state.regionSlug)
  })

  // --- NEW: auto-pick region if only one option exists -----------------
  watch(
    () => regionOptions.value,
    (opts) => {
      if (!state.regionSlug && opts.length === 1) {
        state.regionSlug = opts[0].value
      }
    },
    { immediate: true }
  )

  // ---------- Filtering ----------
  const filtered = computed<InventoryItem[]>(() => {
    const list = source.value ?? []
    const query = state.searchQuery.trim().toLowerCase()
    const hasSearch = query.length > 0

    return list.filter((item) => {
      if (hasSearch) {
        const haystack = [
          item.serialNumber,
          item.lotNumber ?? '',
          item.location?.title ?? '',
          item.product?.title ?? '',
          item.product?.product_line_title ?? '',
          item.size ?? '',
          item.roofColor ?? '',
          item.sidingColor ?? '',
          item.trimColor ?? '',
          item.description ?? '',
          item.highlightedLabel ?? '',
        ].join(' ').toLowerCase()
        if (!haystack.includes(query)) return false
      }

      if (state.productCategorySlug && ((item as any)?.product?.product_category_slug ?? '') !== state.productCategorySlug) {
        return false
      }
      if (state.productLineSlug && (item.product?.product_line_slug ?? '') !== state.productLineSlug) return false
      if (state.productSlug && (item.product?.slug ?? '') !== state.productSlug) return false
      if (state.size && (item.size ?? '') !== state.size) return false

      const price = Number(item.cashPrice ?? 0)
      if (state.minPrice != null && price < state.minPrice) return false
      if (state.maxPrice != null && price > state.maxPrice) return false

      if (state.discounted !== null) {
        const isDiscounted = Number(item.discountAmount ?? 0) > 0
        if (isDiscounted !== state.discounted) return false
      }

      if (state.condition) {
        const isUsed = Boolean(item.usedBuilding)
        const expectUsed = state.condition === 'used'
        if (isUsed !== expectUsed) return false
      }

      if (state.locationSlug && (item.location?.slug ?? '') !== state.locationSlug) return false

      if (state.regionSlug) {
        const regions = item.location?.regions ?? []
        const inRegion = regions.some(r => (r?.slug ?? '') === state.regionSlug)
        if (!inRegion) return false
      }

      if (state.highlightedLabel && (item.highlightedLabel ?? '') !== state.highlightedLabel) {
        return false
      }

      return true
    })
  })

  // ---------- Sorting ----------
const sorted = computed<InventoryItem[]>(() => {
  const base = [...filtered.value]  // preserves API order for "default"
  switch (sortMode.value) {
    case 'default':                 // 👈 add this case
      return base
    case 'price-ascending':
      return base.sort((a, b) => (a.cashPrice ?? 0) - (b.cashPrice ?? 0))
    case 'price-descending':
      return base.sort((a, b) => (b.cashPrice ?? 0) - (a.cashPrice ?? 0))
    case 'product-name':
      return base.sort((a, b) =>
        (a.product?.title ?? '').localeCompare(b.product?.title ?? '') ||
        (a.serialNumber ?? '').localeCompare(b.serialNumber ?? '')
      )
    case 'size-ascending':
      // ... (unchanged)
    case 'size-descending':
      // ... (unchanged)
    case 'distance-from-user':
      // ... (unchanged)
    default:
      return base
  }
})


  // ---------- Chips ----------
  const labelMaps = computed(() => ({
    productCategory: Object.fromEntries(productCategoryOptions.value.map(o => [o.value, o.label])),
    productLine:     Object.fromEntries(productLineOptions.value.map(o => [o.value, o.label])),
    product:         Object.fromEntries(productOptions.value.map(o => [o.value, o.label])),
    size:            Object.fromEntries(sizeOptions.value.map(o => [o.value, o.label])),
    location:        Object.fromEntries(locationOptions.value.map(o => [o.value, o.label])),
    region:          Object.fromEntries(regionOptions.value.map(o => [o.value, o.label])),
    tag:             Object.fromEntries(tagOptions.value.map(o => [o.value, o.label])),
  }))

  const chips = computed<Array<{ key: keyof InventoryFiltersState | 'minPrice' | 'maxPrice'; label: string }>>(() => {
    const labels = labelMaps.value
    const out: Array<{ key: any; label: string }> = []
    if (state.searchQuery) out.push({ key: 'searchQuery', label: `Search: "${state.searchQuery}"` })
    if (state.productCategorySlug) out.push({ key: 'productCategorySlug', label: `Category: ${labels.productCategory[state.productCategorySlug] ?? toLabelFromSlug(state.productCategorySlug)}` })
    if (state.productLineSlug)     out.push({ key: 'productLineSlug',     label: `Product Line: ${labels.productLine[state.productLineSlug] ?? toLabelFromSlug(state.productLineSlug)}` })
    if (state.productSlug)         out.push({ key: 'productSlug',         label: `Product: ${labels.product[state.productSlug] ?? toLabelFromSlug(state.productSlug)}` })
    if (state.size)                out.push({ key: 'size',                label: `Size: ${labels.size[state.size] ?? state.size}` })
    if (state.minPrice != null)    out.push({ key: 'minPrice',            label: `Min: $${state.minPrice}` })
    if (state.maxPrice != null)    out.push({ key: 'maxPrice',            label: `Max: $${state.maxPrice}` })
    if (state.discounted !== null) out.push({ key: 'discounted',          label: state.discounted ? 'Discounted: Yes' : 'Discounted: No' })
    if (state.condition)           out.push({ key: 'condition',           label: `Condition: ${state.condition === 'used' ? 'Used' : 'New'}` })
    if (state.locationSlug)        out.push({ key: 'locationSlug',        label: `Location: ${labels.location[state.locationSlug] ?? toLabelFromSlug(state.locationSlug)}` })
    if (state.highlightedLabel)    out.push({ key: 'highlightedLabel',    label: `Tag: ${labels.tag[state.highlightedLabel] ?? state.highlightedLabel}` })
    // Region intentionally omitted from chips
    return out
  })

  function clearChip(key: keyof InventoryFiltersState | 'minPrice' | 'maxPrice') {
    if (key === 'minPrice' || key === 'maxPrice') (state as any)[key] = null
    else if (key === 'discounted') state.discounted = null
    else if (key === 'condition') state.condition = null
    else if (key === 'searchQuery') state.searchQuery = ''
    else if (key === 'regionSlug') { /* required: do not clear */ }
    else (state as any)[key] = null
  }

  function reset() {
    Object.assign(state, {
      searchQuery: '',
      productCategorySlug: null,
      productLineSlug: null,
      productSlug: null,
      size: null,
      minPrice: null,
      maxPrice: null,
      discounted: null,
      condition: null,
      locationSlug: null,
      // Preserve region (required)
      regionSlug: state.regionSlug,
      highlightedLabel: null,
    } satisfies InventoryFiltersState)
  }

  return {
    state,
    filtered,
    sorted,
    sortMode,
    productCategoryOptions,
    productLineOptions,
    productOptions,
    sizeOptions,
    locationOptions,
    regionOptions,
    tagOptions,
    chips,
    clearChip,
    reset,
  }
}
