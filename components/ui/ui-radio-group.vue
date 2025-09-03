<script setup lang="ts">
/**
 * Radio group.
 * v-model<string | null>
 */
type Option = { value: string; label: string }

const modelValue = defineModel<string | null>({ required: true })

const props = defineProps<{
  label?: string
  name: string
  options: Option[]
  required?: boolean
  inline?: boolean
  wrapperClass?: string
  labelClass?: string
  optionClass?: string
  helpText?: string | null
}>()
</script>

<template>
  <div :class="['w-full', wrapperClass]">
    <span v-if="label" :class="['block text-sm font-medium text-slate-600 dark:text-white mb-1', labelClass]">
      {{ label }} <span v-if="required" aria-hidden="true">*</span>
    </span>

    <div :class="inline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2'">
      <label
        v-for="opt in options"
        :key="opt.value"
        class="inline-flex items-center gap-2 cursor-pointer"
        :class="optionClass"
      >
        <input
          type="radio"
          :name="name"
          :value="opt.value"
          :checked="modelValue === opt.value"
          @change="modelValue = opt.value"
          :required="required"
          class="h-5 w-5 rounded-full border-2 border-slate-600 dark:border-slate-400 text-slate-600"
        />
        <span class="text-slate-700 dark:text-white">{{ opt.label }}</span>
      </label>
    </div>

    <small v-if="helpText" class="block text-xs opacity-70 mt-1">{{ helpText }}</small>
  </div>
</template>
