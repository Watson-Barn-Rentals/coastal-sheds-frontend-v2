// composables/useCustomCss.ts
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead } from '#imports'


export function useCustomCss(
  css: MaybeRefOrGetter<string | undefined | null>
) {
  const cssStr = computed(() => (toValue(css)?.trim() ?? ''))
  const styleId = computed(() => `css-${hash(cssStr.value)}`)
  const styleKey = computed(() => styleId.value)

  useHead(() =>
    cssStr.value
      ? {
          style: [
            {
              id: styleId.value,
              key: styleKey.value,
              children: cssStr.value,
              type: 'text/css',
            },
          ],
        }
      : {} // remove tag when css becomes empty
  )

  return { id: styleId }
}

function hash(s: string) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return (h >>> 0).toString(36)
}
