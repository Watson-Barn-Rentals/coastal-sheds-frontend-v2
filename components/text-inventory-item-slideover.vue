<script lang="ts" setup>
import { computed, ref, unref } from 'vue'
import type { MaybeRef } from '@vueuse/core'
import { textInventoryItem } from '~/services/api/text-inventory-item'

const props = defineProps<{ 
  isMenuOpen: MaybeRef<boolean>
  serialNumber: string
}>()
const emit = defineEmits<{ (e: 'update:isMenuOpen', value: boolean): void }>()

// Readable boolean for the UI component
const isOpen = computed(() => unref(props.isMenuOpen))

const phoneNumber = ref<string | null>(null)
const agreedToTerms = ref<boolean>(false)
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const closeMenu = () => emit('update:isMenuOpen', false)
const toggleMenu = () => emit('update:isMenuOpen', !isOpen.value)

// helper: digits only
const digitsOnly = computed(() => (phoneNumber.value ?? '').replace(/\D+/g, ''))

const isPhoneNumberValid = computed<boolean>(() => /^\d{10}$/.test(digitsOnly.value))

const handleSubmit = async () => {
  errorMessage.value = null
  successMessage.value = null

  if (!isPhoneNumberValid.value || !agreedToTerms.value) return
  if (!props.serialNumber) {
    errorMessage.value = 'Missing inventory serial number.'
    return
  }

  isSubmitting.value = true
  try {
    await textInventoryItem(props.serialNumber, digitsOnly.value)
    successMessage.value = 'Text sent! Check your phone in a moment.'
    setTimeout(closeMenu, 800)
  } catch (err: any) {
    // Prefer a friendly message, but fall back to status text
    errorMessage.value =
      err?.statusMessage ||
      err?.message ||
      'Something went wrong sending your text. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <USlideover
    :open="isOpen"
    :dismissible="false"
    @update:open="val => emit('update:isMenuOpen', val)"
    :ui="{
      content: 'bg-background dark:bg-background-dark',
      wrapper: 'fixed inset-0 flex w-[90vw] ml-[10vw] z-[9999999999]',
    }"
    side="right"
  >
    <template #content>
      <div class="relative">
        <UIcon
          name="material-symbols:close-rounded"
          class="absolute top-4 right-4 h-12 w-12 text-black dark:text-white cursor-pointer"
          @click="toggleMenu"
        />
        <div class="flex flex-col gap-6 pt-16 px-8">
          <h2 class="font-title font-bold text-2xl text-center">Send To My Phone</h2>
          <p>This will text the details of this inventory item to your cell number by SMS.</p>

          <div class="flex flex-col gap-2">
            <UiPhoneInput
              v-model="phoneNumber"
              label="Enter your phone number"
              placeholder="(999) 999-9999"
            />
            <UiCheckboxInput
              v-model="agreedToTerms"
              label="By submitting, you agree to receive text messages at this mobile number. Message & data rates apply."
            />
          </div>

          <button
            class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg transition-all duration-300 ease-in-out group cursor-pointer justify-center"
            :class="{
              'opacity-50 cursor-not-allowed': !isPhoneNumberValid || !agreedToTerms || isSubmitting,
              'hover:-translate-y-1 hover:shadow-xl': isPhoneNumberValid && agreedToTerms && !isSubmitting
            }"
            :disabled="!isPhoneNumberValid || !agreedToTerms || isSubmitting"
            @click="handleSubmit"
          >
            <UIcon
              :name="isSubmitting ? 'eos-icons:loading' : 'eva:message-square-outline'"
              dynamic
              class="h-6 w-6 my-auto sm:h-8 sm:w-8 text-white"
            />
            <p class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto shrink-0">
              {{ isSubmitting ? 'Sending...' : 'Submit' }}
            </p>
          </button>

          <!-- Feedback messages -->
          <p
            v-if="errorMessage"
            class="text-red-600 dark:text-red-400 text-sm"
            role="alert"
            aria-live="polite"
          >
            {{ errorMessage }}
          </p>

          <p
            v-if="successMessage"
            class="text-green-700 dark:text-green-400 text-sm"
            aria-live="polite"
          >
            {{ successMessage }}
          </p>
        </div>
      </div>
    </template>
  </USlideover>
</template>
