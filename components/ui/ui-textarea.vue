<script setup lang="ts">
const modelValue = defineModel<string | null>({ required: true })

const props = defineProps<{
  label?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  wrapperClass?: string
  labelClass?: string
  textareaClass?: string
  helpText?: string | null
}>()

const onInput = (e: Event) => {
  const v = (e.target as HTMLTextAreaElement).value
  modelValue.value = v === '' ? null : v
}
</script>

<template>
  <div :class="['w-full relative', wrapperClass]">
    <label v-if="label" :class="['block text-sm font-medium text-slate-600 dark:text-white', labelClass]">
      {{ label }} <span v-if="required" aria-hidden="true">*</span>
    </label>

    <textarea
      :name="name"
      :id="id"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      :rows="rows ?? 4"
      :value="modelValue ?? ''"
      @input="onInput"
      class="w-full rounded-xl bg-white border-2 border-slate-600 dark:border-slate-400 text-slate-600 px-3 py-2"
      :class="textareaClass"
    />
    <small v-if="helpText" class="block text-xs opacity-70 mt-1">{{ helpText }}</small>
  </div>
</template>
