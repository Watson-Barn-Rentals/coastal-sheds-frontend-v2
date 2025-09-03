<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FaqItem } from '~/types/faq-data'

// Props
const props = defineProps<{ data: FaqItem[] }>()

// Only one panel open at a time
const openIndex = ref<number | null>(null)
const toggle = (i: number) => {
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
  // next frame to allow transition from 0 -> h
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
  // next frame to allow transition from h -> 0
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
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="(faq, i) in data"
      :key="`faq-${i}`"
      :class="{ 'border-t': i !== 0 }"
      class="p-4 bg-background-accent dark:bg-background-accent-dark"
    >
      <!-- Header -->
      <button
        class="w-full flex items-center justify-between text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg cursor-pointer"
        :aria-expanded="openIndex === i"
        :aria-controls="`faq-panel-${i}`"
        :id="`faq-header-${i}`"
        @click="toggle(i)"
      >
        <Heading
          :text="faq.question"
          heading-level="h3"
          text-alignment="left"
          :style="{ fontSize: '1.25rem', lineHeight: '1.5rem' }"
          class="pr-3"
        />
        <UIcon
          name="material-symbols:chevron-right-rounded"
          class="transition-transform duration-200 w-8 h-8 shrink-0"
          :class="openIndex === i ? 'rotate-90' : ''"
          aria-hidden="true"
        />
      </button>

      <!-- Panel (kept in DOM via v-show) with slide animation -->
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
            :style="{ fontSize: '1rem', lineHeight: '1.6' }"
            class="pl-4"
          />

          <!-- Collapse button -->
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
