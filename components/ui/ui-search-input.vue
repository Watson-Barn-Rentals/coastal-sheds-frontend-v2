<script setup lang="ts">
import { HeadlessCombobox, HeadlessComboboxInput } from '#components'

// v-model
const modelValue = defineModel<string>({ required: true })

const props = defineProps<{
  label?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  wrapperClass?: string
  labelClass?: string
  inputClass?: string
}>()

const onInput = (e: Event) => {
  modelValue.value = (e.target as HTMLInputElement).value
}
const clear = () => { modelValue.value = '' }
</script>

<template>
  <div :class="['w-full relative', wrapperClass]">
    <label v-if="label" :class="['block text-sm text-slate-600 dark:text-white font-medium', labelClass]">
      {{ label }}
    </label>

    <HeadlessCombobox v-model="modelValue" :disabled="disabled">
      <div class="relative">
        <HeadlessComboboxInput
          :value="modelValue"
          @input="onInput"
          :placeholder="placeholder ?? 'Search…'"
          :name="name"
          :id="id"
          class="w-full rounded-xl  bg-white border-2 border-slate-600 dark:border-slate-400 text-slate-600 px-3 py-2 pr-10 text-left cursor-text"
          :class="inputClass"
        />

        <!-- Right-side icons -->
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-black/70">
          <UIcon name="mynaui:magnifying-glass" />
        </div>

        <!-- Clear button (clickable) -->
        <button
          v-if="modelValue"
          type="button"
          class="absolute inset-y-0 right-8 flex items-center pr-1 text-black/70 hover:text-black"
          @click="clear"
          aria-label="Clear search"
        >
          <UIcon name="mynaui:xmark" />
        </button>
      </div>
    </HeadlessCombobox>
  </div>
</template>
