<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  country: {
    type: Object,
    default: () => {},
  },
  countryList: {
    type: Array,
    default: [],
  },
  show: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const renderPhoneCode = (item) => {
  const root = item?.idd?.root || ''
  const suffix = item?.idd?.suffixes || ''
  if (!root && !suffix) return 'N/A'
  return `${root}${suffix}`
}

const formatPopulation = (population) => {
  return population ? population.toLocaleString() : 'N/A'
}

const languages = computed(() => {
  return props.country.languages ? Object.values(props.country.languages).join(', ') : 'N/A'
})

const currency = computed(() => {
  if (!props.country.currencies) return 'N/A'
  const currencyData = Object.values(props.country.currencies)[0]
  return `${currencyData.name} (${currencyData.symbol || ''})`
})
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50"
  >
    <div class="relative bg-white rounded-lg shadow-lg max-w-xl w-full overflow-hidden">
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="p-6 flex flex-col md:flex-row gap-6">
        <div class="flex-shrink-0 md:w-1/3">
          <img :src="country.flags?.png" alt="Flag" class="w-full h-auto rounded-md shadow-sm" />
        </div>

        <div class="flex-grow">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ country.name?.official }}</h2>

          <div class="space-y-2 text-gray-600">
            <p>
              <strong>Native Name:</strong> {{ country.name?.nativeName?.eng?.official || 'N/A' }}
            </p>
            <p>
              <strong>Alternative Names:</strong> {{ country.altSpellings.join(', ') || 'N/A' }}
            </p>
            <p><strong>Phone Code:</strong> {{ renderPhoneCode(country) }}</p>
            <p><strong>Country Code:</strong> {{ country.cca2 }} / {{ country.cca3 }}</p>
            <p><strong>Region:</strong> {{ country.region }}</p>
            <p><strong>Subregion:</strong> {{ country.subregion || 'N/A' }}</p>
            <p><strong>Languages:</strong> {{ languages }}</p>
            <p><strong>Currency:</strong> {{ currency }}</p>
            <p><strong>Population:</strong> {{ formatPopulation(country.population) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
