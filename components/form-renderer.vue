<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { navigateTo } from '#app'
import type { FormItem, Field, OptionArray, OptionKV } from '~/types/form-data'
import { normalizeOptions } from '~/types/form-data'
import { submitTrackingEvent } from '~/services/submit-tracking-event';

const props = defineProps<{
  form: FormItem
  submitLabel?: string
  navigateOnSuccess?: boolean
}>()

const emit = defineEmits<{
  (e: 'submitted'): void
  (e: 'success'): void
  (e: 'error', err: unknown): void
}>()

const values = ref<Record<string, any>>({})
const status = ref<'idle'|'submitting'|'success'|'error'>('idle')
const fileValues = ref<Record<string, FileList | null>>({})

// --- helpers ---
const colClass = (w: Field['width']) => (w === '1/3' ? 'md:col-span-4' : w === '1/2' ? 'md:col-span-6' : 'md:col-span-12')
const hasFileInput = computed(() => props.form.fields.some(f => f.type === 'file'))
const encodePair = (k: string, v: any) => encodeURIComponent(k) + '=' + encodeURIComponent(v ?? '')

const normType = (t: unknown) => String(t ?? '').toLowerCase()
const isTextLike = (t: unknown) => ['text','email','tel','url','password'].includes(normType(t))
const isTextarea = (t: unknown) => normType(t) === 'textarea'

// Pre-init checkbox arrays so v-model is a valid member expression everywhere
watchEffect(() => {
  for (const f of props.form.fields) {
    if (f.type === 'checkbox' && Array.isArray(f.options) && !Array.isArray(values.value[f.key])) {
      values.value[f.key] = []
    }
  }
})

// Submit to Netlify
const onSubmit = async (e: Event) => {
  
  e.preventDefault()
  emit('submitted')
  status.value = 'submitting'

  try {
    let ok = false

    if (hasFileInput.value) {
      const fd = new FormData()
      fd.append('form-name', props.form.netlifyName)

      // non-file fields
      for (const f of props.form.fields) {
        if (f.type === 'file') continue
        const key = f.key
        const v = values.value[key]
        if (Array.isArray(v)) v.forEach((val: string) => fd.append(`${key}[]`, val))
        else if (v != null) fd.append(key, String(v))
      }

      // file fields
      for (const f of props.form.fields) {
        if (f.type !== 'file') continue
        const files = fileValues.value[f.key]
        if (files && files.length) {
          if (f.meta?.multiple) Array.from(files).forEach(file => fd.append(`${f.key}[]`, file))
          else fd.append(f.key, files[0])
        }
      }

      if (values.value['bot-field']) fd.append('bot-field', String(values.value['bot-field']))
      const r = await fetch('/', { method: 'POST', body: fd })
      ok = r.ok
    } else {
      const parts: string[] = []
      parts.push(encodePair('form-name', props.form.netlifyName))

      // primitives
      for (const f of props.form.fields) {
        const key = f.key
        const v = values.value[key]
        if (Array.isArray(v)) continue
        if (v != null) parts.push(encodePair(key, v))
      }
      // arrays
      for (const f of props.form.fields) {
        const key = f.key
        const v = values.value[key]
        if (Array.isArray(v)) v.forEach((val: string) => parts.push(encodePair(`${key}[]`, val)))
      }
      // honeypot
      if (values.value['bot-field']) parts.push(encodePair('bot-field', values.value['bot-field']))

      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: parts.join('&'),
      })
      ok = r.ok
    }

    if (!ok) throw new Error('Netlify submission failed')

    status.value = 'success'
    emit('success')
    submitTrackingEvent(`form-submission:${props.form.slug}`)

    if (props.navigateOnSuccess && props.form.redirectUrl) {
      await navigateTo(props.form.redirectUrl)
      return
    }

    // Clear
    const next: Record<string, any> = {}
    for (const f of props.form.fields) {
      if (f.type === 'checkbox' && Array.isArray(values.value[f.key])) next[f.key] = []
      else if (f.type !== 'hidden') next[f.key] = ''
      if (f.type === 'file') fileValues.value[f.key] = null
    }
    values.value = next
  } catch (err) {
    status.value = 'error'
    emit('error', err)
  }
}
</script>

<template>
  <form
    :name="form.netlifyName"
    method="POST"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
    :action="form.redirectUrl || undefined"
    @submit="onSubmit"
    class="grid grid-cols-12 gap-4"
  >
    <input type="hidden" name="form-name" :value="form.netlifyName" />

    <p class="hidden">
      <label>Don’t fill this out:
        <input name="bot-field" v-model="values['bot-field']" />
      </label>
    </p>

    <template v-for="field in form.fields" :key="field.key">
      <!-- Hidden -->
      <input v-if="field.type === 'hidden'" type="hidden" :name="field.key" v-model="values[field.key]" />

      <!-- TEL: use ui-phone-input -->
      <div v-else-if="normType(field.type) === 'tel'" :class="['col-span-12', colClass(field.width)]">
        <UiPhoneInput
          :label="field.label"
          :placeholder="field.placeholder || '(555) 123-4567'"
          :name="field.key"
          :id="field.key"
          :disabled="false"
          v-model="values[field.key]"
        />
        <small v-if="field.helpText" class="block text-xs opacity-70 mt-1">{{ field.helpText }}</small>
      </div>

      <!-- Text-like (text/email/url/password) -->
      <div v-else-if="isTextLike(field.type)" :class="['col-span-12', colClass(field.width)]">
        <UiText
          :type="(normType(field.type) as any)"
          :label="field.label"
          :placeholder="field.placeholder || undefined"
          :name="field.key"
          :id="field.key"
          :required="field.required"
          :autocomplete="field.meta?.autocomplete as string | undefined"
          :inputmode="field.meta?.inputmode as  | 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined"
          :pattern="field.meta?.pattern as string | undefined"
          :min-length="field.meta?.minLength as number | undefined"
          :max-length="field.meta?.maxLength as number | undefined"
          :help-text="field.helpText"
          :clearable="true"
          :reveal-password="true"
          v-model="values[field.key]"
        />
      </div>

      <div v-else-if="isTextarea(field.type)" :class="['col-span-12', colClass(field.width)]">
        <UiTextarea
          :label="field.label"
          :placeholder="field.placeholder || undefined"
          :name="field.key"
          :id="field.key"
          :required="field.required"
          :help-text="field.helpText"
          v-model="values[field.key]"
        />
      </div>

      <!-- Select -->
      <div v-else-if="field.type === 'select'" :class="['col-span-12', colClass(field.width)]">
        <UiSelect
          :label="field.label"
          :placeholder="field.placeholder || 'Select…'"
          :options="normalizeOptions(field.options as OptionArray | OptionKV)"
          v-model="values[field.key]"
          :show-blank="!field.required"
        />
        <small v-if="field.helpText" class="block text-xs opacity-70 mt-1">{{ field.helpText }}</small>
      </div>

      <!-- Radio Group -->
      <div v-else-if="field.type === 'radio'" :class="['col-span-12', colClass(field.width)]">
        <UiRadioGroup
          :label="field.label"
          :name="field.key"
          :options="normalizeOptions(field.options as OptionArray | OptionKV)"
          :required="field.required"
          v-model="values[field.key]"
          :help-text="field.helpText"
        />
      </div>

      <!-- Checkbox -->
      <div v-else-if="field.type === 'checkbox'" :class="['col-span-12', colClass(field.width)]">
        <template v-if="normalizeOptions(field.options as OptionArray | OptionKV).length">
          <UiCheckboxGroup
            :label="field.label"
            :name="field.key"
            :options="normalizeOptions(field.options as OptionArray | OptionKV)"
            :required="field.required"
            :model-value="Array.isArray(values[field.key]) ? values[field.key] : []"
            @update:model-value="(v: string[]) => (values[field.key] = v)"
            :help-text="field.helpText"
          />
        </template>
        <template v-else>
          <UiCheckbox
            :label="field.label"
            :name="field.key"
            :id="field.key"
            v-model="values[field.key]"
          />
          <small v-if="field.helpText" class="block text-xs opacity-70 mt-1">{{ field.helpText }}</small>
        </template>
      </div>

      <!-- File -->
      <div v-else-if="field.type === 'file'" :class="['col-span-12', colClass(field.width)]">
        <UiFile
          :label="field.label"
          :name="field.key"
          :id="field.key"
          :required="field.required"
          :multiple="Boolean(field.meta?.multiple)"
          :accept="(field.meta?.accept as string | undefined)"
          :help-text="field.helpText"
          v-model="fileValues[field.key]"
        />
      </div>
    </template>

    <div class="col-span-12">
      <div class="flex justify-center">
        <button 
          type="submit" 
          :disabled="status==='submitting'" 
          class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out group cursor-pointer"
        >
          {{ status === 'submitting' ? 'Sending…' : (submitLabel || 'Send') }}
        </button>
      </div>
      <p v-if="status==='success'" class="text-green-600 mt-2">
        {{ form.successMessage || 'Thanks! We’ll be in touch.' }}
      </p>
      <p v-if="status==='error'" class="text-red-600 mt-2">Sorry, something went wrong.</p>
    </div>
  </form>
</template>