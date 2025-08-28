<script lang="ts" setup>
import { computed, unref } from 'vue'
import type { MaybeRef } from '@vueuse/core'

const props = defineProps<{ 
    isMenuOpen: MaybeRef<boolean> 
    serialNumber: string
}>()
const emit = defineEmits<{ (e: 'update:isMenuOpen', value: boolean): void }>()

// Readable boolean for the UI component
const isOpen = computed(() => unref(props.isMenuOpen))

const phoneNumber = ref<string | null>(null)
const agreedToTerms = ref<boolean>(false)

const closeMenu = () => emit('update:isMenuOpen', false)
const toggleMenu = () => emit('update:isMenuOpen', !isOpen.value)

const handleSubmit = () => {
  
}

const isPhoneNumberValid = computed<boolean>(() => {
  const phoneRegex = /^\d{10}$/
  return phoneNumber.value ? phoneRegex.test(phoneNumber.value) : false
})

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
        <div class="flex flex-col gap-8 pt-16 px-8">
            <h2 class="font-title font-bold text-2xl text-center">Send To My Phone</h2>
            <p class="">This will text the details of this inventory item to your cell number by SMS.</p>
            <div class="flex flex-col gap-1">
                <UiPhoneInput v-model="phoneNumber" label="Enter your phone number" placeholder="(999) 999-9999" />
                <UiCheckboxInput v-model="agreedToTerms" class="" label="By submitting, you agree to receive text messages at this mobile number. Message & data rates apply." />
            </div>
            <button
              class="flex gap-2 p-3 rounded-lg text-white bg-brand shadow-lg transition-all duration-300 ease-in-out group cursor-pointer justify-center"
              :class="{
                'opacity-50 cursor-not-allowed': !isPhoneNumberValid || !agreedToTerms,
                'hover:-translate-y-1 hover:shadow-xl': isPhoneNumberValid && agreedToTerms
              }"
              :disabled="!isPhoneNumberValid || !agreedToTerms"
              @click="handleSubmit"
            >
                <UIcon
                  name="eva:message-square-outline"
                  dynamic
                  class="h-6 w-6 my-auto sm:h-8 sm:w-8 text-white"
                />
                <p
                  class="font-title select-none text-white font-semibold text-sm sm:text-base my-auto shrink-0"
                >
                  Submit
                </p>
            </button>
        </div>
      </div>
    </template>
  </USlideover>
</template>
