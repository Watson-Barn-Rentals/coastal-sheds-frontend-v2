<script setup lang="ts">
/** v-model<string|null> */
const modelValue = defineModel<string | null>({ required: true })

type InputMode =
  | 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'

const props = defineProps<{
  // (we keep tel out of *type*, since you render tel with your UiPhoneInput)
  type?: 'text' | 'email' | 'url' | 'password'
  label?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
  inputmode?: InputMode
  pattern?: string
  minLength?: number
  maxLength?: number
  clearable?: boolean
  revealPassword?: boolean
  wrapperClass?: string
  labelClass?: string
  inputClass?: string
  helpText?: string | null
}>()

const localType = ref(props.type ?? 'text')
watch(() => props.type, t => { localType.value = t ?? 'text' })

const inputEl = ref<HTMLInputElement | null>(null)

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  modelValue.value = v === '' ? null : v
}

function clear() {
  if (inputEl.value) inputEl.value.value = ''
  modelValue.value = null
}

// Keep password toggle logic
const canReveal = computed(() => props.revealPassword && (props.type === 'password'))
const isPassword = computed(() => localType.value === 'password')
function togglePassword() {
  localType.value = isPassword.value ? 'text' : 'password'
}

/** Optional: sanitize inputmode to the allowed union at runtime too */
const allowedInputModes = new Set<InputMode>([
  'none','text','tel','url','email','numeric','decimal','search',
])
const resolvedInputmode = computed<InputMode | undefined>(() =>
  props.inputmode && allowedInputModes.has(props.inputmode) ? props.inputmode : undefined
)
</script>

<template>
  <div :class="['w-full relative', wrapperClass]">
    <label v-if="label" :class="['block text-sm font-medium text-slate-600 dark:text-white', labelClass]">
      {{ label }} <span v-if="required" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <input
        ref="inputEl"
        :type="localType"
        :name="name"
        :id="id"
        :disabled="disabled"
        :required="required"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :inputmode="resolvedInputmode"
        :pattern="pattern"
        :minlength="minLength"
        :maxlength="maxLength"
        :value="modelValue ?? ''"
        @input="onInput"
        class="w-full rounded-xl bg-white border-2 border-slate-600 dark:border-slate-400 text-slate-600 px-3 py-2 pr-10"
        :class="inputClass"
      />

      <div class="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
        <button
          v-if="canReveal"
          type="button"
          class="text-black/70 hover:text-black"
          @click="togglePassword"
          :aria-label="isPassword ? 'Show password' : 'Hide password'"
        >
          <UIcon :name="isPassword ? 'mynaui:eye' : 'mynaui:eye-slash'" />
        </button>

        <button
          v-if="clearable && modelValue"
          type="button"
          class="text-black/70 hover:text-black"
          @click="clear"
          aria-label="Clear input"
        >
          <UIcon name="mynaui:xmark" />
        </button>
      </div>
    </div>

    <small v-if="helpText" class="block text-xs opacity-70 mt-1">{{ helpText }}</small>
  </div>
</template>
