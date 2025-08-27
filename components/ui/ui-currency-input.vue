<script setup lang="ts">
import { HeadlessCombobox, HeadlessComboboxInput } from '#components'

/**
 * Digits-only currency input.
 * v-model<number|null> — stores numbers (e.g., 12999) or null when empty.
 */
const modelValue = defineModel<number | null>({ required: true })

const props = defineProps<{
  label?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  prefix?: string          // visual prefix (e.g. '$')
  showPrefix?: boolean     // whether to show the visual prefix
  wrapperClass?: string
  labelClass?: string
  inputClass?: string
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const localText = ref<string>(modelValue.value != null ? String(modelValue.value) : '')

watch(() => modelValue.value, (val) => {
  if (document.activeElement !== inputEl.value) {
    localText.value = val != null ? String(val) : ''
  }
})

function digitsOnly(text: string): string {
  return text.replace(/\D+/g, '')
}

function onBeforeInput(payload: Event) {
  const ev = payload as InputEvent
  if (ev.inputType === 'insertText') {
    const ch = (ev as any).data as string | null
    if (ch && /\D/.test(ch)) ev.preventDefault()
  }
}

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const cleaned = digitsOnly(el.value)
  if (cleaned !== el.value) el.value = cleaned
  localText.value = cleaned
  modelValue.value = cleaned === '' ? null : Number(cleaned)
}

function clear() {
  localText.value = ''
  modelValue.value = null
  if (inputEl.value) inputEl.value.value = ''
}
</script>

<template>
  <div :class="['w-full relative', wrapperClass]">
    <label v-if="label" :class="['block text-sm font-medium text-slate-600 dark:text-white', labelClass]">
      {{ label }}
    </label>

    <HeadlessCombobox :model-value="localText">
      <div class="relative">
        <!-- Prefix -->
        <span
          v-if="showPrefix"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-70"
        >
          {{ prefix ?? '$' }}
        </span>

        <HeadlessComboboxInput
          ref="inputEl"
          type="text"
          :value="localText"
          @beforeinput="onBeforeInput"
          @input="onInput"
          :placeholder="placeholder ?? '0'"
          :name="name"
          :id="id"
          :disabled="disabled"
          inputmode="numeric"
          pattern="[0-9]*"
          class="w-full rounded-xl  bg-white border-2 border-slate-600 dark:border-slate-400 text-slate-600 px-3 py-2"
          :class="[inputClass, showPrefix ? 'pl-7' : '']"
          aria-label="Currency amount"
        />

        <!-- Right-side clear icon -->
        <button
          v-if="localText"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-black/70 hover:text-black"
          @click="clear"
          aria-label="Clear amount"
        >
          <UIcon name="mynaui:xmark" />
        </button>
      </div>
    </HeadlessCombobox>
  </div>
</template>
