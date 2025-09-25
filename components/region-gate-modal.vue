<!-- ~/components/RegionGateModal.vue -->
<script setup lang="ts">
import { computed, unref } from 'vue'

type Option = { value: string; label: string }
type MaybeRef<T> = T | import('vue').Ref<T>

const props = defineProps<{
  /** Accept a boolean or a Ref<boolean> */
  open: MaybeRef<boolean>
  /** Accept Option[] or a Ref<Option[]> */
  options: MaybeRef<Option[]>
  /** Accept string|null or a Ref<string|null> */
  modelValue: MaybeRef<string | null>
}>()

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'update:modelValue', v: string | null): void
  (e: 'confirm', slug: string): void
}>()

/** Unwrapped, TS-safe values */
const openBool = computed(() => unref(props.open))
const optionsList = computed(() => unref(props.options))
const selectedValue = computed(() => unref(props.modelValue))

const canConfirm = computed(
  () => !!selectedValue.value && optionsList.value.some(o => o.value === selectedValue.value)
)
</script>

<template>
  <teleport to="body">
    <div
      v-if="openBool"
      class="fixed inset-0 z-[999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60"></div>

      <!-- Panel -->
      <div class="relative w-[92vw] max-w-md rounded-2xl bg-background dark:bg-background-dark shadow-2xl p-6 space-y-6">
        <div class="flex flex-col">
            <p class="text-xl text-center font-bold">
              We have inventory in multiple regions.
            </p>
            <p class="text-xl text-center">
              Choose one to continue.
            </p>
        </div>

        <!-- Region select -->
        <UiSelect
          :model-value="selectedValue"
          @update:model-value="(v) => emit('update:modelValue', v)"
          :options="optionsList"
          placeholder="Choose a region"
          :show-blank="true"
          label="Region"
        />

        <div class="flex gap-3 pt-2">
          <button
            class="flex-1 rounded-xl px-4 py-2 font-semibold bg-brand text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!canConfirm"
            @click="() => emit('confirm', selectedValue as string)"
          >
            Continue
          </button>
        </div>

        <!-- Intentionally no outside-click/ESC close -->
      </div>
    </div>
  </teleport>
</template>
