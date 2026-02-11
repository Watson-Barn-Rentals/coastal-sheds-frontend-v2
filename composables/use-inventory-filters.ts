// ~/composables/useInventoryFilters.ts
import { useRoute, useRouter } from "#imports"
import { useDebounceFn } from "@vueuse/core"
import { computed, reactive, ref, watch, onMounted } from "vue"
import type { ComputedRef, Ref } from "vue"
import { isPlaceholderInventoryItem, type InventoryItem } from "~/types/inventory-item"

export type InventoryFiltersState = {
  searchQuery: string
  productCategorySlug: string | null
  productLineSlug: string | null
  productSlug: string | null
  size: string | null
  minPrice: number | null
  maxPrice: number | null
  discounted: boolean | null
  condition: "new" | "used" | null
  locationSlug: string | null
  regionSlug: string | null
  highlightedLabel: string | null
}

export type InventorySortMode =
  | "default"
  | "price-ascending"
  | "price-descending"
  | "product-name"
  | "size-ascending"
  | "size-descending"
  | "distance-from-user"

type UrlQuery = Record<string, string | undefined>
type Option = { value: string; label: string }

// --- helpers ------------------------------------------------------------
function toLabelFromSlug(value: string): string {
  const s = decodeURIComponent(value).replace(/[-_]+/g, " ").trim()
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}
function withSelected(list: Option[], selected?: string | null): Option[] {
  if (!selected) return list
  if (list.some((o) => o.value === selected)) return list
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
    discounted: state.discounted === null ? undefined : state.discounted ? "1" : "0",
    condition: state.condition ?? undefined,
    location: state.locationSlug || undefined,
    region: state.regionSlug || undefined,
    tag: state.highlightedLabel || undefined,
  }
}

function queryToState(query: UrlQuery): InventoryFiltersState {
  return {
    searchQuery: query.search ?? "",
    productCategorySlug: query.productCategory ?? null,
    productLineSlug: query.productLine ?? null,
    productSlug: query.product ?? null,
    size: query.size ?? null,
    minPrice: query.minPrice != null ? Number(query.minPrice) : null,
    maxPrice: query.maxPrice != null ? Number(query.maxPrice) : null,
    discounted: query.discounted == null ? null : query.discounted === "1",
    condition:
      query.condition === "new" || query.condition === "used" ? (query.condition as any) : null,
    locationSlug: query.location ?? null,
    regionSlug: query.region ?? null,
    highlightedLabel: query.tag ?? null,
  }
}

function parseSizeToArea(size: string | null | undefined): number {
  if (!size) return NaN
  const m = size.match(/(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)/)
  if (!m) return NaN
  const w = Number(m[1])
  const l = Number(m[2])
  return Number.isFinite(w) && Number.isFinite(l) ? w * l : NaN
}

function parseSortMode(q: string | undefined): InventorySortMode {
  const allowed: InventorySortMode[] = [
    "default",
    "price-ascending",
    "price-descending",
    "product-name",
    "size-ascending",
    "size-descending",
    "distance-from-user",
  ]
  return allowed.includes(q as InventorySortMode) ? (q as InventorySortMode) : "default"
}

function readBrowserQuery(): UrlQuery {
  if (!import.meta.client) return {}
  const params = new URLSearchParams(window.location.search)
  const out: UrlQuery = {}
  for (const [k, v] of params.entries()) {
    // match how Nuxt route.query behaves (single values)
    out[k] = v
  }
  return out
}

export function useInventoryFilters(
  source: Ref<InventoryItem[] | null>,
  opts?: { distanceMetersByLocationSlug?: Ref<Record<string, number | null>> }
) {
  const route = useRoute()
  const router = useRouter()

  /**
   * CRITICAL: Do not read route.query during hydration.
   * Cached SSR payload can carry an old query, and you'll “snap back” to it.
   */
  const state = reactive<InventoryFiltersState>(queryToState({}))
  const sortMode = ref<InventorySortMode>("default")

  const readyToWriteUrl = ref(false)

  const pushQueryToUrl = useDebounceFn(() => {
    if (!readyToWriteUrl.value) return

    const next: Record<string, any> = {
      ...route.query,
      ...stateToQuery(state),
      sort: sortMode.value,
    }

    for (const key of Object.keys(next)) if (next[key] === undefined) delete next[key]
    router.replace({ query: next })
  }, 250)

  watch(state, pushQueryToUrl, { deep: true })
  watch(sortMode, pushQueryToUrl)

  onMounted(() => {
    // Sync from the *actual URL* (not SSR payload / route.query during hydration)
    const q = readBrowserQuery()
    Object.assign(state, queryToState(q))
    sortMode.value = parseSortMode(q.sort)

    // Now allow writing URL changes caused by UI interactions
    readyToWriteUrl.value = true
  })

  // After we are ready, keep state synced if user navigates back/forward
  watch(
    () => route.query,
    (q) => {
      if (!readyToWriteUrl.value) return
      Object.assign(state, queryToState(q as any as UrlQuery))
      sortMode.value = parseSortMode((q as any as UrlQuery).sort)
    }
  )

  // ---------- Option builders ----------
  const productCategoryOptions = computed<Option[]>(() => {
    const map = new Map<string, string>()
    for (const item of source.value ?? []) {
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
    for (const item of source.value ?? []) {
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
    for (const item of source.value ?? []) {
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
    for (const item of source.value ?? []) if (item.size) set.add(item.size)
    const list = [...set].sort().map((v) => ({ value: v, label: v }))
    return withSelected(list, state.size)
  })

  const locationOptions = computed<Option[]>(() => {
    const map = new Map<string, string>()
    for (const item of source.value ?? []) {
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
    for (const item of source.value ?? []) {
      const tag = item.highlightedLabel?.trim()
      if (tag) set.add(tag)
    }
    const list = [...set].sort((a, b) => a.localeCompare(b)).map((v) => ({ value: v, label: v }))
    return withSelected(list, state.highlightedLabel)
  })

  const regionOptions = computed<Option[]>(() => {
    const map = new Map<string, string>()
    for (const item of source.value ?? []) {
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

  // auto-pick region if only one option exists
  watch(
    () => regionOptions.value,
    (optsList) => {
      if (!state.regionSlug && optsList.length === 1) state.regionSlug = optsList[0].value
    },
    { immediate: true }
  )

  // ---------- Filtering ----------
  const filtered = computed<InventoryItem[]>(() => {
    const list = source.value ?? []
    const query = state.searchQuery.trim().toLowerCase()
    const hasSearch = query.length > 0

    return list.filter((item) => {
      if (isPlaceholderInventoryItem(item)) return true

      if (hasSearch) {
        const haystack = [
          item.serialNumber,
          item.lotNumber ?? "",
          item.location?.title ?? "",
          item.product?.title ?? "",
          item.product?.product_line_title ?? "",
          item.size ?? "",
          item.description ?? "",
          item.highlightedLabel ?? "",
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }

      if (state.productCategorySlug && ((item as any)?.product?.product_category_slug ?? "") !== state.productCategorySlug)
        return false
      if (state.productLineSlug && (item.product?.product_line_slug ?? "") !== state.productLineSlug) return false
      if (state.productSlug && (item.product?.slug ?? "") !== state.productSlug) return false
      if (state.size && (item.size ?? "") !== state.size) return false

      const price = Number(item.cashPrice ?? 0)
      if (state.minPrice != null && price < state.minPrice) return false
      if (state.maxPrice != null && price > state.maxPrice) return false

      if (state.discounted !== null) {
        const isDiscounted = Number(item.discountAmount ?? 0) > 0
        if (isDiscounted !== state.discounted) return false
      }

      if (state.condition) {
        const isUsed = Boolean(item.usedBuilding)
        const expectUsed = state.condition === "used"
        if (isUsed !== expectUsed) return false
      }

      if (state.locationSlug && (item.location?.slug ?? "") !== state.locationSlug) return false

      if (state.regionSlug) {
        const regions = item.location?.regions ?? []
        const inRegion = regions.some((r) => (r?.slug ?? "") === state.regionSlug)
        if (!inRegion) return false
      }

      if (state.highlightedLabel && (item.highlightedLabel ?? "") !== state.highlightedLabel) return false

      return true
    })
  })

  // ---------- Sorting ----------
  const sorted = computed<InventoryItem[]>(() => {
    const base = [...filtered.value]
    switch (sortMode.value) {
      case "default":
        return base
      case "price-ascending":
        return base.sort((a, b) => (a.cashPrice ?? 0) - (b.cashPrice ?? 0))
      case "price-descending":
        return base.sort((a, b) => (b.cashPrice ?? 0) - (a.cashPrice ?? 0))
      case "product-name":
        return base.sort(
          (a, b) =>
            (a.product?.title ?? "").localeCompare(b.product?.title ?? "") ||
            (a.serialNumber ?? "").localeCompare(b.serialNumber ?? "")
        )
      case "size-ascending":
        return base.sort((a, b) => {
          const aa = parseSizeToArea(a.size)
          const bb = parseSizeToArea(b.size)
          if (Number.isNaN(aa) && Number.isNaN(bb)) return (a.size ?? "").localeCompare(b.size ?? "")
          if (Number.isNaN(aa)) return 1
          if (Number.isNaN(bb)) return -1
          return aa - bb
        })
      case "size-descending":
        return base.sort((a, b) => {
          const aa = parseSizeToArea(a.size)
          const bb = parseSizeToArea(b.size)
          if (Number.isNaN(aa) && Number.isNaN(bb)) return (b.size ?? "").localeCompare(a.size ?? "")
          if (Number.isNaN(aa)) return 1
          if (Number.isNaN(bb)) return -1
          return bb - aa
        })
      case "distance-from-user": {
        const metersBySlug = opts?.distanceMetersByLocationSlug?.value ?? {}
        return base.sort((a, b) => {
          const da = metersBySlug[a.location?.slug ?? ""]
          const db = metersBySlug[b.location?.slug ?? ""]
          if (da == null && db == null) return 0
          if (da == null) return 1
          if (db == null) return -1
          return da - db
        })
      }
      default:
        return base
    }
  })

  // ---------- Chips ----------
  const labelMaps = computed(() => ({
    productCategory: Object.fromEntries(productCategoryOptions.value.map((o) => [o.value, o.label])),
    productLine: Object.fromEntries(productLineOptions.value.map((o) => [o.value, o.label])),
    product: Object.fromEntries(productOptions.value.map((o) => [o.value, o.label])),
    size: Object.fromEntries(sizeOptions.value.map((o) => [o.value, o.label])),
    location: Object.fromEntries(locationOptions.value.map((o) => [o.value, o.label])),
    region: Object.fromEntries(regionOptions.value.map((o) => [o.value, o.label])),
    tag: Object.fromEntries(tagOptions.value.map((o) => [o.value, o.label])),
  }))

  const chips = computed<Array<{ key: keyof InventoryFiltersState | "minPrice" | "maxPrice"; label: string }>>(() => {
    const labels = labelMaps.value
    const out: Array<{ key: any; label: string }> = []
    if (state.searchQuery) out.push({ key: "searchQuery", label: `Search: "${state.searchQuery}"` })
    if (state.productCategorySlug) out.push({ key: "productCategorySlug", label: `Category: ${labels.productCategory[state.productCategorySlug] ?? toLabelFromSlug(state.productCategorySlug)}` })
    if (state.productLineSlug) out.push({ key: "productLineSlug", label: `Product Line: ${labels.productLine[state.productLineSlug] ?? toLabelFromSlug(state.productLineSlug)}` })
    if (state.productSlug) out.push({ key: "productSlug", label: `Product: ${labels.product[state.productSlug] ?? toLabelFromSlug(state.productSlug)}` })
    if (state.size) out.push({ key: "size", label: `Size: ${labels.size[state.size] ?? state.size}` })
    if (state.minPrice != null) out.push({ key: "minPrice", label: `Min: $${state.minPrice}` })
    if (state.maxPrice != null) out.push({ key: "maxPrice", label: `Max: $${state.maxPrice}` })
    if (state.discounted !== null) out.push({ key: "discounted", label: state.discounted ? "Discounted: Yes" : "Discounted: No" })
    if (state.condition) out.push({ key: "condition", label: `Condition: ${state.condition === "used" ? "Used" : "New"}` })
    if (state.locationSlug) out.push({ key: "locationSlug", label: `Location: ${labels.location[state.locationSlug] ?? toLabelFromSlug(state.locationSlug)}` })
    if (state.highlightedLabel) out.push({ key: "highlightedLabel", label: `Tag: ${labels.tag[state.highlightedLabel] ?? state.highlightedLabel}` })
    return out
  })

  function clearChip(key: keyof InventoryFiltersState | "minPrice" | "maxPrice") {
    if (key === "minPrice" || key === "maxPrice") (state as any)[key] = null
    else if (key === "discounted") state.discounted = null
    else if (key === "condition") state.condition = null
    else if (key === "searchQuery") state.searchQuery = ""
    else if (key === "regionSlug") {
      /* required: do not clear */
    } else (state as any)[key] = null
  }

  function reset() {
    Object.assign(state, {
      searchQuery: "",
      productCategorySlug: null,
      productLineSlug: null,
      productSlug: null,
      size: null,
      minPrice: null,
      maxPrice: null,
      discounted: null,
      condition: null,
      locationSlug: null,
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
