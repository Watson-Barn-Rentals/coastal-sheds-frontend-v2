<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import { ref, computed, nextTick } from 'vue'
import type { CustomCssStyling } from '~/types/custom-css-styling';
import type { FaqItem } from '~/types/faq-data'

/* NEW: optional offset for sticky headers */
const SCROLL_OFFSET = 0 // change to your sticky header height, e.g. 96

// Props
const props = defineProps<{ 
  data: FaqItem[] 
  wrapperCustomStyling?: CustomCssStyling
  faqItemCustomStyling?: CustomCssStyling
  questionCustomStyling?: CustomCssStyling
  answerCustomStyling?: CustomCssStyling
}>()

// Only one panel open at a time
const openIndex = ref<number | null>(null)

/* NEW: queue the index we want to scroll to after the previous panel collapses */
const pendingScrollTo = ref<number | null>(null)

/* NEW: collect header elements to scroll to */
const headerRefs = ref<HTMLElement[]>([])
const setHeaderRef = (i: number) => (el: Element | ComponentPublicInstance | null) => {
  headerRefs.value[i] = (el as HTMLElement) || undefined as any
}

/* NEW: helper */
const scrollToHeader = (i: number) => {
  if (typeof window === 'undefined') return
  const el = headerRefs.value[i]
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
  window.scrollTo({ top: y, behavior: 'smooth' })
}

const toggle = (i: number) => {
  // If switching from one open item to another, queue a scroll to the new header
  if (openIndex.value !== null && openIndex.value !== i) {
    pendingScrollTo.value = i
  }
  openIndex.value = openIndex.value === i ? null : i
}

// --- slide animation hooks (work with v-show) ---
const onBeforeEnter = (el: Element) => {
  const e = el as HTMLElement
  e.style.height = '0px'
  e.style.opacity = '0'
  e.style.overflow = 'hidden'
}
const onEnter = (el: Element, done: () => void) => {
  const e = el as HTMLElement
  const h = e.scrollHeight
  e.style.transition = 'height 200ms ease, opacity 200ms ease'
  requestAnimationFrame(() => {
    e.style.height = `${h}px`
    e.style.opacity = '1'
  })
  const end = () => {
    e.removeEventListener('transitionend', end)
    e.style.height = ''
    e.style.opacity = ''
    e.style.transition = ''
    e.style.overflow = ''
    done()
  }
  e.addEventListener('transitionend', end)
}
const onBeforeLeave = (el: Element) => {
  const e = el as HTMLElement
  e.style.height = `${e.scrollHeight}px`
  e.style.opacity = '1'
  e.style.overflow = 'hidden'
}
const onLeave = (el: Element, done: () => void) => {
  const e = el as HTMLElement
  e.style.transition = 'height 200ms ease, opacity 200ms ease'
  requestAnimationFrame(() => {
    e.style.height = '0px'
    e.style.opacity = '0'
  })
  const end = () => {
    e.removeEventListener('transitionend', end)
    e.style.height = ''
    e.style.opacity = ''
    e.style.transition = ''
    e.style.overflow = ''

    /* NEW: after collapse finishes, do the queued scroll */
    if (pendingScrollTo.value !== null) {
      const target = pendingScrollTo.value
      pendingScrollTo.value = null
      nextTick(() => scrollToHeader(target))
    }
    done()
  }
  e.addEventListener('transitionend', end)
}

// --- SEO: FAQPage JSON-LD ---
const stripTags = (html: string | undefined | null) =>
  (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const faqJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: (props.data ?? []).map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: stripTags((faq as any).answer),
    },
  })),
}))

useHead(() => ({
  script: [
    {
      key: 'faq-jsonld',
      type: 'application/ld+json',
      children: JSON.stringify(faqJsonLd.value),
    },
  ],
}))

useCustomCss(props.wrapperCustomStyling?.css ?? '');
useCustomCss(props.faqItemCustomStyling?.css ?? '');
useCustomCss(props.questionCustomStyling?.css ?? '');
useCustomCss(props.answerCustomStyling?.css ?? '');
</script>


<template>
  <div :class="twMerge('flex flex-col bg-black gap-[2px]', wrapperCustomStyling?.classNames?.join(' '))">
    <div
      v-for="(faq, i) in data"
      :key="`faq-${i}`"
      :class="twMerge('p-4 bg-background-accent dark:bg-background-accent-dark', faqItemCustomStyling?.classNames?.join(' '))"
    >
      <!-- Header -->
      <button
        class="w-full flex items-center justify-between text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg cursor-pointer"
        :aria-expanded="openIndex === i"
        :aria-controls="`faq-panel-${i}`"
        :id="`faq-header-${i}`"
        :ref="setHeaderRef(i)"
        @click="toggle(i)"
      >
        <h3
          :class="twMerge('pr-3 text-md font-bold text-xl text-title', questionCustomStyling?.classNames?.join(' '))"
        >
          {{ faq.question }}
        </h3>
        <UIcon
          name="material-symbols:chevron-right-rounded"
          class="transition-transform duration-200 w-8 h-8 shrink-0"
          :class="openIndex === i ? 'rotate-90' : ''"
          aria-hidden="true"
        />
      </button>

      <!-- Panel -->
      <Transition
        :css="false"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
      >
        <div
          v-show="openIndex === i"
          :id="`faq-panel-${i}`"
          role="region"
          :aria-labelledby="`faq-header-${i}`"
          class="mt-3"
        >
          <WysiwygRenderer
            :content="faq.answer"
            :class="twMerge('pl-4', answerCustomStyling?.classNames?.join(' '))"
          />
          <div class="mt-4 flex">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm underline underline-offset-2 hover:no-underline focus:outline-none"
              :aria-controls="`faq-panel-${i}`"
              @click="openIndex = null"
            >
              <UIcon name="material-symbols:expand-less-rounded" class="w-5 h-5" aria-hidden="true" />
              Collapse
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>


<style scoped>
.standard-faq-item-border {
  border-color: var(--border-color);
}
</style>