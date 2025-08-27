<!-- /components/ui/ui-select.vue -->
<script setup lang="ts">
import { HeadlessListbox, HeadlessListboxButton, HeadlessListboxOption, HeadlessListboxOptions } from '#components';



type Option = { value: string; label: string }
/** v-model */
const modelValue = defineModel<string | null>({ required: true })

const props = defineProps<{
  label?: string
  options: Option[]
  placeholder?: string
  disabled?: boolean
  showBlank?: boolean        // default true; hide for "Sort by"
  wrapperClass?: string
  labelClass?: string
  buttonClass?: string
  optionsClass?: string
  optionClass?: string
}>()

const showBlank = computed(() => props.showBlank ?? true)
const internalValue = computed({
  get: () => modelValue.value,
  set: (v: string | null) => (modelValue.value = v),
})
</script>

<template>
  <div :class="['w-full relative', wrapperClass]">
    <label v-if="label" :class="['block text-sm text-slate-600 dark:text-white', labelClass]">
      {{ label }}
    </label>

    <HeadlessListbox v-model="internalValue" :disabled="disabled">
      <div class="relative">
        <HeadlessListboxButton
          :class="[
            'w-full rounded-xl bg-white border-2 border-slate-600 dark:border-slate-400 text-slate-600 px-3 py-2 text-left cursor-pointer pr-8',
            buttonClass
          ]"
        >
          <span v-if="internalValue === null && showBlank" class="opacity-60">
            {{ placeholder ?? 'All' }}
          </span>
          <span v-else>
            {{ options.find(o => o.value === internalValue)?.label ?? placeholder ?? 'Select…' }}
          </span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <UIcon
                name="mynaui:chevron-up-down"
            />
          </span>
        </HeadlessListboxButton>

        <HeadlessListboxOptions
          :class="[
            'absolute z-50 mt-2 max-h-64 min-w-full overflow-auto rounded-xl border-2 bg-white border-slate-600 dark:border-slate-400 text-slate-600 shadow-xl',
            optionsClass
          ]"
        >
          <HeadlessListboxOption
            v-if="showBlank"
            :value="null"
            v-slot="{ active, selected }"
            as="template"
          >
            <li
              :class="[
                'cursor-pointer px-3 py-2',
                active ? 'bg-neutral-200' : '',
                optionClass
              ]"
            >
              <span :class="[selected ? 'font-semibold' : '']">{{ placeholder ?? 'All' }}</span>
            </li>
          </HeadlessListboxOption>

          <HeadlessListboxOption
            v-for="o in options"
            :key="o.value"
            :value="o.value"
            v-slot="{ active, selected }"
            as="template"
          >
            <li
              :class="[
                'cursor-pointer px-3 py-2 text-nowrap',
                active ? 'bg-neutral-200' : '',
                selected ? 'font-semibold' : '',
                optionClass
              ]"
            >
              {{ o.label }}
            </li>
          </HeadlessListboxOption>
        </HeadlessListboxOptions>
      </div>
    </HeadlessListbox>
  </div>
</template>
