<script setup lang="ts">
import { computed } from "vue"
import prerenderedRoutes from "#build/prerender-routes.generated"

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

const PRERENDER_SET = new Set<string>(prerenderedRoutes as readonly string[])

const isExternal = (s: string) =>
  /^https?:\/\//i.test(s) || s.startsWith("mailto:") || s.startsWith("tel:")

const normalizeForLookup = (input: string): string => {
  if (!input) return "/"

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

const nuxtLinkTo = computed(() => props.to ?? props.href)

const rawForLookup = computed(() => {
  if (props.href) return props.href
  if (typeof props.to === "string") return props.to
  if (props.to && typeof props.to === "object" && props.to.path) return props.to.path
  return ""
})

const normalized = computed(() => normalizeForLookup(rawForLookup.value))
const isPrerendered = computed(() => PRERENDER_SET.has(normalized.value))

const useAnchor = computed(() => {
  if (rawForLookup.value && isExternal(rawForLookup.value)) return true
  return !isPrerendered.value // internal but not prerendered => hard nav
})

const anchorHref = computed(() => {
  if (props.href) return props.href
  if (typeof props.to === "string") return props.to
  if (props.to && typeof props.to === "object" && props.to.path) return props.to.path
  return rawForLookup.value || "#"
})

const relAttr = computed(() => {
  if (props.rel) return props.rel
  if (props.target === "_blank") return "noopener noreferrer"
  return undefined
})

const shouldPrefetch = computed(() => props.prefetch ?? true)
</script>

<template>
  <NuxtLink v-if="!useAnchor" :to="nuxtLinkTo" :prefetch="shouldPrefetch">
    <slot />
  </NuxtLink>

  <a v-else :href="anchorHref" :target="target" :rel="relAttr">
    <slot />
  </a>
</template>
