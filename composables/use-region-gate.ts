// ~/composables/useRegionGate.ts
import { computed, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { InventoryItem } from '~/types/inventory-item'

type Option = { value: string; label: string }

type UseRegionGateOpts = {
  items: Ref<InventoryItem[] | null>
  regionSlug: Ref<string | null>            // bind to your filters.state.regionSlug
  regionOptions: Ref<Option[]>              // from useInventoryFilters
  storageKey?: string                       // session storage key
  rememberInSession?: boolean               // default: true
  autoPickIfSingle?: boolean                // default: true
}

export function useRegionGate (opts: UseRegionGateOpts) {
  const {
    items,
    regionSlug,
    regionOptions,
    storageKey = 'region-gate:preferred-region',
    rememberInSession = true,
    autoPickIfSingle = true,
  } = opts

  const open = ref(false)
  const selected = ref<string | null>(null)

  const distinctRegionSlugs = computed(() => {
    const set = new Set<string>()
    for (const item of (items.value ?? [])) {
      const regions = item.location?.regions ?? []
      for (const r of regions) if (r?.slug) set.add(r.slug)
    }
    return Array.from(set)
  })

  const hasMultipleRegions = computed(() => distinctRegionSlugs.value.length > 1)

  function applySelection(slug: string) {
    regionSlug.value = slug
    selected.value = slug
    if (rememberInSession) {
      try { sessionStorage.setItem(storageKey, slug) } catch {}
    }
    open.value = false
  }

  function restoreFromSession(): string | null {
    try { return sessionStorage.getItem(storageKey) } catch { return null }
  }

  const decide = () => {
    if (regionSlug.value) { open.value = false; return }
    const count = distinctRegionSlugs.value.length
    if (count === 0) { open.value = false; return }

    if (count === 1) {
      if (autoPickIfSingle) {
        const only = distinctRegionSlugs.value[0]
        applySelection(only)
      } else {
        open.value = false
      }
      return
    }

    const restored = restoreFromSession()
    if (restored && distinctRegionSlugs.value.includes(restored)) {
      applySelection(restored)
      return
    }

    open.value = true
  }

  onMounted(() => decide())
  watch([items, regionSlug, regionOptions], decide, { deep: true })

  return {
    open,
    selected,
    hasMultipleRegions,
    distinctRegionSlugs,
    options: regionOptions,
    applySelection,
  }
}
