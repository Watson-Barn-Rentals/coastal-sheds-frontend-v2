<script setup lang="ts">
import { computed } from "vue"

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
  target?: string
  rel?: string
}>()

const anchorHref = computed(() => {
  if (props.href) return props.href
  if (typeof props.to === "string") return props.to
  if (props.to && typeof props.to === "object" && props.to.path) return props.to.path
  return "#"
})

const relAttr = computed(() => {
  if (props.rel) return props.rel
  if (props.target === "_blank") return "noopener noreferrer"
  return undefined
})
</script>

<template>
  <a :href="anchorHref" :target="target" :rel="relAttr">
    <slot />
  </a>
</template>
