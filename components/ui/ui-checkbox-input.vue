<script setup lang="ts">
/**
 * CheckboxField
 * v-model<boolean> — true/false
 * Optional visual indeterminate state (doesn't change the bound value).
 */
const modelValue = defineModel<boolean>({ required: true })

const props = defineProps<{
  label?: string
  description?: string
  name?: string
  id?: string
  disabled?: boolean
  indeterminate?: boolean

  wrapperClass?: string
  labelClass?: string
  inputClass?: string
  descriptionClass?: string
}>()

const inputEl = ref<HTMLInputElement | null>(null)

function applyIndeterminate() {
  // Show the indeterminate dash only when requested and unchecked
  if (inputEl.value) {
    inputEl.value.indeterminate = !!props.indeterminate && !modelValue.value
  }
}

onMounted(applyIndeterminate)
watch(() => props.indeterminate, applyIndeterminate)
watch(() => modelValue.value, applyIndeterminate)
</script>

<template>
  <div :class="['w-full relative', wrapperClass]">
    <label
      :for="id"
      class="flex items-start gap-3 cursor-pointer select-none"
      :class="{ 'opacity-60 cursor-not-allowed': disabled }"
    >
      <input
        ref="inputEl"
        type="checkbox"
        :id="id"
        :name="name"
        :disabled="disabled"
        v-model="modelValue"
        class="h-8 w-8 rounded-md border-2 border-slate-600 dark:border-slate-400
               text-slate-600 focus:ring-2 focus:ring-offset-2 focus:ring-slate-500
               disabled:opacity-60 disabled:cursor-not-allowed my-auto"
        :class="inputClass"
        :aria-checked="modelValue ? 'true' : (indeterminate ? 'mixed' : 'false')"
      />

      <div class="pt-0.5">
        <span
          v-if="label"
          class="block text-sm font-medium text-slate-700 dark:text-white"
          :class="labelClass"
        >{{ label }}</span>

        <p
          v-if="description"
          class="text-sm text-slate-500 dark:text-slate-300 mt-0.5"
          :class="descriptionClass"
        >{{ description }}</p>
      </div>
    </label>
  </div>
</template>
