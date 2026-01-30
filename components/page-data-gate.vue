<script setup lang="ts">
import { computed, unref } from 'vue'

type Source = {
  data: any            // Ref<unknown>
  pending?: any        // Ref<boolean>
  error?: any          // Ref<unknown>
  refresh?: () => any  // () => Promise<void> | void
}

const props = defineProps<{
  /** One or more asyncData sources */
  sources: Source[]
  /** If true (default), require ALL sources to be non-null. If false, at least one must be non-null. */
  requireAll?: boolean
  /** If true (default), treat “all null & no explicit error” as Not Found (404). */
  notFoundWhenNull?: boolean
  /** Optional friendly titles/messages */
  notFoundTitle?: string
  notFoundMessage?: string
  errorTitle?: string
  errorMessage?: string
}>()

const requireAll = computed(() => props.requireAll ?? true)
const notFoundWhenNull = computed(() => props.notFoundWhenNull ?? true)

function statusCodeOf(err: any): number | null {
  const e = unref(err)
  return (
    e?.statusCode ??
    e?.status ??
    e?.response?.status ??
    e?.data?.statusCode ??
    null
  )
}

const anyPending = computed(
  () => props.sources.some(s => Boolean(unref(s.pending)))
)

const errors = computed(() =>
  props.sources
    .map(s => unref(s.error))
    .filter(Boolean)
)

watch(errors, (newErrors) => {
  if (newErrors.length) {
    console.error('Page Data Gate encountered errors:', newErrors)
  }
}, { immediate: true })

const has404Only = computed(() => {
  if (!errors.value.length) return false
  const codes = errors.value.map(statusCodeOf).filter(Boolean)
  // show 404 only if there is at least one 404 and there are no non-404 codes
  return codes.length > 0 && codes.every(c => c === 404)
})

const hasOtherError = computed(() => {
  if (!errors.value.length) return false
  const codes = errors.value.map(statusCodeOf)
  // generic error if any non-404 code or unknown error object
  return codes.some(c => c !== 404 || c == null)
})

const dataValues = computed(() => props.sources.map(s => unref(s.data)))
const truthyFlags = computed(() => dataValues.value.map(v => v != null))

const allHaveData = computed(() => truthyFlags.value.every(Boolean))
const anyHaveData = computed(() => truthyFlags.value.some(Boolean))

const passGate = computed(() =>
  (requireAll.value ? allHaveData.value : anyHaveData.value) &&
  !has404Only.value &&
  !hasOtherError.value
)

const showNotFound = computed(() => {
  if (has404Only.value) return true
  if (!anyPending.value && !errors.value.length && notFoundWhenNull.value) {
    // no explicit errors, but data missing
    return requireAll.value ? !allHaveData.value : !anyHaveData.value
  }
  return false
})

const showGenericError = computed(() => hasOtherError.value)
const showLoading = computed(() => anyPending.value && !showNotFound.value && !showGenericError.value)

async function refreshAll() {
  await Promise.allSettled(props.sources.map(s => s.refresh?.()).filter(Boolean) as Promise<any>[])
}
</script>

<template>
  <!-- Loading -->
<slot name="loading" v-if="showLoading">
  <div class="w-full rounded-2xl border-2 border-background-accent dark:border-background-accent-dark bg-background-accent dark:bg-background-accent-dark p-6 md:p-8">
    <div class="mx-auto max-w-prose h-screen flex flex-col items-center justify-center text-center gap-2">
      <p class="text-4xl font-medium text-foreground/90" aria-live="polite">
        Loading
        <span class="inline-flex ml-1 align-middle" aria-hidden="true">
          <span class="loading-dot w-3 h-3 rounded-full bg-current mx-0.5"></span>
          <span class="loading-dot w-3 h-3 rounded-full bg-current mx-0.5"></span>
          <span class="loading-dot w-3 h-3 rounded-full bg-current mx-0.5"></span>
        </span>
      </p>
    </div>
  </div>
</slot>

  <!-- 404 -->
<slot name="not-found" v-else-if="showNotFound" :refresh-all="refreshAll">
  <div class="w-full rounded-2xl border-2 border-background-accent dark:border-background-accent-dark bg-background-accent dark:bg-background-accent-dark p-6 md:p-8">
    <div class="mx-auto max-w-prose h-screen flex flex-col items-center justify-center text-center gap-2">
      <p class="text-4xl font-semibold tracking-tight">
        {{ notFoundTitle ?? '404 Not Found' }}
      </p>
      <p class="opacity-80 text-xl">
        {{ notFoundMessage ?? 'I\'m sorry! We couldn’t find the content you are looking for.' }}
      </p>
    </div>
  </div>
</slot>


  <!-- Generic error -->
  <slot name="error" v-else-if="showGenericError" :errors="errors" :refresh-all="refreshAll">
  <div class="w-full rounded-2xl border-2 border-background-accent dark:border-background-accent-dark bg-background-accent dark:bg-background-accent-dark p-6 md:p-8">
    <div class="mx-auto max-w-prose h-screen flex flex-col items-center justify-center text-center gap-2">
      <p class="text-4xl font-semibold tracking-tight">
        {{ errorTitle ?? 'Well that wasn\'t supposed to happen...' }}
      </p>
      <p class="opacity-80 text-xl">
        {{ errorMessage ?? 'I\'m sorry! We encountered an error. Please try again or reach out to us!' }}
      </p>
    </div>
  </div>
  </slot>

  <!-- OK: render page content -->
  <div v-else>
    <slot :refresh-all="refreshAll" />
  </div>
</template>
<style scoped>
@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0); opacity: .25; }
  40% { transform: scale(1); opacity: 1; }
}
.loading-dot {
  animation: dotPulse 1.4s infinite ease-in-out both;
}
.loading-dot:nth-child(2) { animation-delay: .2s; }
.loading-dot:nth-child(3) { animation-delay: .4s; }
</style>