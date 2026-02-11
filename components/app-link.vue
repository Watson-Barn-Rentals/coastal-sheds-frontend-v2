<script setup lang="ts">
import { computed } from "vue"

// Generated at build time into `.nuxt/prerender-routes.generated.ts`
let PRERENDERED: readonly string[] = []
try {
  PRERENDERED = (await import("#build/prerender-routes.generated")).default ?? []
} catch {
  PRERENDERED = []
}

const PRERENDER_SET = new Set<string>(PRERENDERED as string[])

type To =
  | string
  | {
      path?: string
      name?: string
      params?: Record<string, any>
      query?: Record<string, any>
    }

const props = defineProps<{
  to?: To
  href?: string
  prefetch?: boolean
  target?: string
  rel?: string
}>()

const isExternal = (s: string) =>
  /^https?:\/\//i.test(s) || s.startsWith("mailto:") || s.startsWith("tel:")

const normalizeForLookup = (input: string): string => {
  if (!input) return "/"

  // If someone passed an absolute URL, only use pathname for normalization
  // (but we still treat absolute as external for rendering unless it's your own domain)
  let p = input
  try {
    if (/^https?:\/\//i.test(input)) p = new URL(input).pathname
  } catch {
    // ignore
  }

  p = (p.split("?")[0] ?? "").split("#")[0] ?? "/"
  if (!p.startsWith("/")) p = `/${p}`
  p = p.replace(/\/+/g, "/")
  if (p !== "/" && !p.endsWith("/")) p += "/"
  return p
}

const raw = computed(() => {
  if (props.href) return props.href
  if (typeof props.to === "string") return props.to
  if (props.to && typeof props.to === "object" && props.to.path) return props.to.path
  return ""
})

const normalized = computed(() => normalizeForLookup(raw.value))

const isPrerendered = computed(() => {
  // If the list contains normalized routes already, this should match exactly.
  return PRERENDER_SET.has(normalized.value)
})

const useAnchor = computed(() => {
  // External always anchor
  if (raw.value && isExternal(raw.value)) return true

  // If it’s internal but NOT prerendered -> hard nav anchor
  // If internal and prerendered -> AppLink
  return !isPrerendered.value
})

const AppLinkTo = computed(() => props.to ?? props.href)
const anchorHref = computed(() => {
  if (props.href) return props.href
  if (typeof props.to === "string") return props.to
  if (props.to && typeof props.to === "object" && props.to.path) return props.to.path
  return raw.value || "#"
})

const rel = computed(() => {
  if (props.rel) return props.rel
  if (props.target === "_blank") return "noopener noreferrer"
  return undefined
})

const shouldPrefetch = computed(() => props.prefetch ?? true)
</script>

<template>
  <AppLink
    v-if="!useAnchor"
    :to="AppLinkTo"
    :prefetch="shouldPrefetch"
  >
    <slot />
  </AppLink>

  <a
    v-else
    :href="anchorHref"
    :target="target"
    :rel="rel"
  >
    <slot />
  </a>
</template>
