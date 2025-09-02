<script lang="ts" setup>
import { computed } from 'vue'
type Option = { value: string; label: string }

const filters = defineModel<{
  searchQuery: string
  productCategorySlug: string | null
  productLineSlug: string | null
  productSlug: string | null
  size: string | null
  minPrice: number | null
  maxPrice: number | null
  discounted: boolean | null
  condition: 'new' | 'used' | null
  locationSlug: string | null
  regionSlug: string | null
}>('filters', { required: true })

const props = defineProps<{
  productCategoryOptions: Option[]
  productLineOptions: Option[]
  productOptions: Option[]
  sizeOptions: Option[]
  locationOptions: Option[]
  regionOptions: Option[]
  chips: Array<{ key: any; label: string }>
}>()

const emit = defineEmits<{ (e: 'clear-chip', key: any): void; (e: 'reset'): void }>()

// Discounted select bridge
const discountedSelectValue = computed<string | null>({
  get: () => filters.value.discounted === null ? null : (filters.value.discounted ? '1' : '0'),
  set: (val) => { filters.value.discounted = (val === null || val === '') ? null : val === '1' }
})
</script>

<template>
  <div class="w-full bg-background-accent dark:bg-background-accent-dark rounded-2xl shadow-lg border-4 border-background-accent dark:border-background-accent-dark p-4 md:p-6 mt-6 space-y-3">
    <p class="font-title text-center text-xl font-bold">Filters</p>

    <!-- Chips ... (unchanged) -->
    <div class="flex flex-wrap gap-4">
      <div
        v-for="chip in props.chips"
        :key="chip.key"
        class="flex items-center gap-2 text-sm border-2 border-slate-600 dark:border-slate-400 rounded-full p-2"
      >
        <span class="my-auto">{{ chip.label }}</span>
        <button @click="$emit('clear-chip', chip.key)" class="cursor-pointer h-4 w-4 hover:scale-150 transition-all duration-150">
          <UIcon
            name="material-symbols:close"
          />
        </button>
      </div>
      <div
        v-if="props.chips.length > 0"
        class="flex items-center gap-2 text-sm border-2 border-slate-600 dark:border-slate-400 rounded-full p-2"
      >
        <button @click="$emit('reset')" class="cursor-pointer">
          <span class="italic shrink-0">Clear All Filters</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 items-end">
      <!-- Search -->
      <UiSearchInput
        v-model="filters.searchQuery"
        label="Search"
        placeholder="Serial number, colors, etc..."
        class="md:col-span-2"
      />

      <!-- Product Category (NEW, before Product Line) -->
      <UiSelect
        v-model="filters.productCategorySlug"
        :options="productCategoryOptions"
        label="Product Category"
        placeholder="All"
        :show-blank="true"
      />

      <!-- Product Line -->
      <UiSelect
        v-model="filters.productLineSlug"
        :options="productLineOptions"
        label="Product Line"
        placeholder="All"
        :show-blank="true"
      />

      <!-- Product -->
      <UiSelect
        v-model="filters.productSlug"
        :options="productOptions"
        label="Product"
        placeholder="All"
        :show-blank="true"
      />

      <!-- Size -->
      <UiSelect
        v-model="filters.size"
        :options="sizeOptions"
        label="Size"
        placeholder="All"
        :show-blank="true"
      />

      <!-- Price -->
      <div class="grid grid-cols-2 gap-3">
        <UiCurrencyInput v-model="filters.minPrice" label="Min Price" placeholder="0" :showPrefix="true" prefix="$" />
        <UiCurrencyInput v-model="filters.maxPrice" label="Max Price" placeholder="0" :showPrefix="true" prefix="$" />
      </div>

      <!-- Discounted -->
      <UiSelect
        v-model="discountedSelectValue"
        :options="[{ value: '1', label: 'Discounted only' }, { value: '0', label: 'Not discounted' }]"
        label="Discounted"
        placeholder="All"
        :show-blank="true"
      />

      <!-- Condition -->
      <UiSelect
        v-model="filters.condition"
        :options="[{ value: 'new', label: 'New' }, { value: 'used', label: 'Used' }]"
        label="Condition"
        placeholder="All"
        :show-blank="true"
      />

      <!-- Location -->
      <UiSelect v-model="filters.locationSlug" :options="locationOptions" label="Location" placeholder="All" :show-blank="true" />

      <!-- Region -->
      <UiSelect v-model="filters.regionSlug" :options="regionOptions" label="Region" placeholder="All" :show-blank="true" />
    </div>
  </div>
</template>
