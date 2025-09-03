<script setup lang="ts">
/**
 * File input.
 * v-model<FileList | null>
 */
const modelValue = defineModel<FileList | null>({ required: true })

const props = defineProps<{
  label?: string
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  accept?: string
  wrapperClass?: string
  labelClass?: string
  inputClass?: string
  helpText?: string | null
}>()

const inputEl = ref<HTMLInputElement | null>(null)

function onChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  modelValue.value = files && files.length ? files : null
}

function clear() {
  if (inputEl.value) inputEl.value.value = ''
  modelValue.value = null
}
</script>

<template>
  <div :class="['w-full relative', wrapperClass]">
    <label v-if="label" :class="['block text-sm font-medium text-slate-600 dark:text-white', labelClass]">
      {{ label }} <span v-if="required" aria-hidden="true">*</span>
    </label>

    <input
      ref="inputEl"
      type="file"
      :name="name"
      :id="id"
      :disabled="disabled"
      :required="required"
      :multiple="multiple"
      :accept="accept"
      @change="onChange"
      class="w-full rounded-xl bg-white border-2 border-slate-600 dark:border-slate-400 text-slate-600 px-3 py-2"
      :class="inputClass"
    />

    <div class="absolute inset-y-0 right-0 flex items-center pr-3" v-if="modelValue">
      <button type="button" class="text-black/70 hover:text-black" @click="clear" aria-label="Clear files">
        <UIcon name="mynaui:xmark" />
      </button>
    </div>

    <small v-if="helpText" class="block text-xs opacity-70 mt-1">{{ helpText }}</small>
  </div>
</template>
