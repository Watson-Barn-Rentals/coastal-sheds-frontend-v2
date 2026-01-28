import { computed, ref, unref, watch, type MaybeRef } from "vue"
import type { IdeasGalleryEntry } from "~/types/ideas-gallery-entry"
import type { IdeasGalleryTag } from "~/types/ideas-gallery-tag"

export type IdeasGalleryTagWithActiveState = IdeasGalleryTag & {
  isActive: boolean
}

type UseIdeasGalleryFiltersOptions = {
  queryKey?: string // default "tag"
}

export const useIdeasGalleryFilters = (
  ideasGalleryEntries: MaybeRef<IdeasGalleryEntry[]>,
  options: UseIdeasGalleryFiltersOptions = {}
) => {
  const queryKey = options.queryKey ?? "tag"

  const route = useRoute()
  const router = useRouter()

  const entries = computed(() => unref(ideasGalleryEntries) ?? [])

  const normalizeQueryValue = (v: unknown): string | null => {
    if (typeof v === "string" && v.trim()) return v
    if (Array.isArray(v) && typeof v[0] === "string" && v[0].trim()) return v[0]
    return null
  }

  const availableTagSlugs = computed(() => {
    const set = new Set<string>()
    for (const entry of entries.value) {
      for (const tag of entry.tags) set.add(tag.slug)
    }
    return set
  })

  const activeTagSlug = ref<string | null>(normalizeQueryValue(route.query[queryKey]))

  let isSyncing = false

  const stripFilterFromUrl = async () => {
    const nextQuery = { ...route.query }
    delete nextQuery[queryKey]

    isSyncing = true
    activeTagSlug.value = null

    if (import.meta.server) {
      // SSR: real redirect (no flicker)
      await navigateTo({ query: nextQuery }, { replace: true })
    } else {
      // Client: seamless replace (no history entry)
      await router.replace({ query: nextQuery })
    }

    isSyncing = false
  }

  // ✅ If URL has invalid tag once tags are known, instantly replace URL w/out filters
  watch(
    availableTagSlugs,
    async (slugs) => {
      if (isSyncing) return

      const urlSlug = normalizeQueryValue(route.query[queryKey])
      if (!urlSlug) return
      if (slugs.size === 0) return // not loaded yet

      if (!slugs.has(urlSlug)) {
        await stripFilterFromUrl()
      } else if (activeTagSlug.value !== urlSlug) {
        activeTagSlug.value = urlSlug
      }
    },
    { immediate: true }
  )

  // ✅ Back/forward/manual edits: if invalid, strip it immediately
  watch(
    () => route.query[queryKey],
    async (v) => {
      if (isSyncing) return

      const slug = normalizeQueryValue(v)
      if (!slug) {
        if (activeTagSlug.value !== null) activeTagSlug.value = null
        return
      }

      if (availableTagSlugs.value.size > 0 && !availableTagSlugs.value.has(slug)) {
        await stripFilterFromUrl()
        return
      }

      if (activeTagSlug.value !== slug) activeTagSlug.value = slug
    }
  )

  // ✅ State -> URL when user clicks filters
  watch(
    activeTagSlug,
    async (slug) => {
      if (isSyncing) return

      const current = normalizeQueryValue(route.query[queryKey])
      if (current === slug) return

      const nextQuery = { ...route.query }
      if (slug) nextQuery[queryKey] = slug
      else delete nextQuery[queryKey]

      isSyncing = true
      await router.replace({ query: nextQuery })
      isSyncing = false
    },
    { flush: "post" }
  )

  const filteredIdeasGalleryEntries = computed(() => {
    return entries.value.filter((entry) => {
      if (activeTagSlug.value) {
        return entry.tags.some((tag) => tag.slug === activeTagSlug.value)
      }
      return true
    })
  })

  const hiddenIdeasGalleryEntriesCount = computed(() => {
    return entries.value.length - filteredIdeasGalleryEntries.value.length
  })

  const tagFilterOptions = computed<IdeasGalleryTagWithActiveState[]>(() => {
  	// key by slug to ensure true uniqueness
  	const tagsBySlug = new Map<string, IdeasGalleryTag>()

  	for (const entry of entries.value) {
  		for (const tag of entry.tags) {
  			// keep the first occurrence to preserve natural order
  			if (!tagsBySlug.has(tag.slug)) tagsBySlug.set(tag.slug, tag)
  		}
  	}

    return Array.from(tagsBySlug.values())
    	.sort((a, b) => a.title.localeCompare(b.title))
    	.map((tag) => ({ ...tag, isActive: tag.slug === activeTagSlug.value }))
  })


  const setTagSlugFilter = (slug: string) => {
    activeTagSlug.value = slug
  }

  const removeFilters = () => {
    activeTagSlug.value = null
  }

  return {
    activeTagSlug,
    filteredIdeasGalleryEntries,
    tagFilterOptions,
    hiddenIdeasGalleryEntriesCount,
    setTagSlugFilter,
    removeFilters,
  }
}
