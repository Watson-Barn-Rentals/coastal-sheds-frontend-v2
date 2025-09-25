<script setup lang="ts">
import { HeadlessCombobox, HeadlessComboboxInput } from '#components'
import { nextTick } from 'vue'

/**
 * US phone input (10 digits). Displays as (xxx) xxx-xxxx.
 * v-model<string|null> stores raw digits "5551234567" or null when empty.
 */
const modelValue = defineModel<string | null>({ required: true })

const props = defineProps<{
  label?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  wrapperClass?: string
  labelClass?: string
  inputClass?: string
  required?: boolean
}>()

const inputEl = ref<HTMLInputElement | null>(null)

// derive visible text from model (format if present)
const localText = ref<string>(modelValue.value ? formatPhone(modelValue.value) : '')

watch(() => modelValue.value, (val) => {
  // keep in sync when not actively typing
  if (document.activeElement !== inputEl.value) {
    localText.value = val ? formatPhone(val) : ''
  }
})

function digitsOnly(text: string): string {
  return text.replace(/\D+/g, '')
}

function formatPhone(digits: string): string {
  const d = digits.slice(0, 10)
  const a = d.slice(0, 3)
  const b = d.slice(3, 6)
  const c = d.slice(6, 10)
  if (d.length <= 3) return a ? `(${a}` : ''
  if (d.length <= 6) return `(${a}) ${b}`
  return `(${a}) ${b}-${c}`
}

function onBeforeInput(payload: Event) {
  const ev = payload as InputEvent
  if (ev.inputType === 'insertText') {
    const ch = (ev as any).data as string | null
    if (ch && /\D/.test(ch)) ev.preventDefault()
  }
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? ''
  const digits = digitsOnly(text).slice(0, 10)
  e.preventDefault()
  const formatted = formatPhone(digits)
  localText.value = formatted
  modelValue.value = digits === '' ? null : digits
  nextTick(() => {
    if (inputEl.value) inputEl.value.value = formatted
  })
}

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const digits = digitsOnly(el.value).slice(0, 10)
  const formatted = formatPhone(digits)
  if (formatted !== el.value) el.value = formatted
  localText.value = formatted
  modelValue.value = digits === '' ? null : digits
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
      {{ label }} <span v-if="required" aria-hidden="true">*</span>
    </label>

    <HeadlessCombobox :model-value="localText">
      <div class="relative">
        <HeadlessComboboxInput
          ref="inputEl"
          type="tel"
          :value="localText"
          @beforeinput="onBeforeInput"
          @paste="onPaste"
          @input="onInput"
          :placeholder="placeholder"
          :name="name"
          :required="required"
          :id="id"
          :disabled="disabled"
          inputmode="tel"
          autocomplete="tel"
          pattern="\(\d{3}\)\s?\d{3}-\d{4}"
          maxlength="14"
          class="w-full rounded-xl bg-white border-2 border-slate-600 dark:border-slate-400 text-slate-600 px-3 py-2"
          :class="inputClass"
          aria-label="Phone number"
        />

        <!-- Right-side clear icon -->
        <button
          v-if="localText"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-black/70 hover:text-black"
          @click="clear"
          aria-label="Clear phone number"
        >
          <UIcon name="mynaui:xmark" />
        </button>
      </div>
    </HeadlessCombobox>
  </div>
</template>
