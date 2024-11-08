<script setup>
import { onMounted, ref, computed } from 'vue'
import TableUI from '../components/TableUI.vue'
import Pagination from '../components/Pagination.vue'
import CountryModal from '../components/CountryModal.vue'

const tableColumns = [
  { key: 'flag', title: 'Flag' },
  { key: 'name', title: 'Country', sortable: true },
  { key: 'cca2', title: 'Code (2)', width: '10%' },
  { key: 'cca3', title: 'Code (3)', width: '10%' },
  { key: 'nativeName', title: 'Native Name' },
  { key: 'altName', title: 'Alternative Name' },
  { key: 'idd', title: 'Phone Code', width: '15%' },
]
const countryList = ref([])
const currentPage = ref(1)
const pageSize = ref(25)
const searchQuery = ref('')
const sortOrder = ref('asc')
const sortKey = ref('name')
const selectedCountry = ref(null)

const fetchCountryList = () => {
  fetch('https://restcountries.com/v3.1/all')
    .then((response) => response.json())
    .then((data) => {
      countryList.value = data
    })
    .catch((error) => console.error('Error:', error))
}

const countryListFilter = computed(() => {
  let filteredList = countryList.value

  if (searchQuery.value) {
    filteredList = filteredList.filter((country) =>
      country.name.official.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  if (sortKey.value) {
    filteredList = [...filteredList].sort((a, b) => {
      const aValue = a[sortKey.value]?.official || a[sortKey.value]
      const bValue = b[sortKey.value]?.official || b[sortKey.value]

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  return filteredList
})

const countryListPerPage = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return countryListFilter.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(countryListFilter.value.length / pageSize.value))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const onSortChange = (event) => {
  sortKey.value = event.sortKey
  sortOrder.value = event.sortOrder
}

const renderPhoneCode = (item) => {
  const root = item?.idd?.root || ''
  const suffix = item?.idd?.suffixes || ''
  if (!root && suffix) return 'N/A'

  return `${root}${suffix}`
}

const openModal = (item) => {
  selectedCountry.value = item
}

const closeModal = () => {
  selectedCountry.value = null
}

onMounted(() => fetchCountryList())
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden p-6 border border-gray-200">
      <div class="w-full flex justify-between items-center mb-3 mt-1 pl-3">
        <div>
          <h3 class="text-lg font-semibold text-slate-800">Country List</h3>
          <p class="text-slate-500">List all of countries around the world.</p>
        </div>
        <div class="ml-3">
          <div class="w-full max-w-sm min-w-[200px] relative">
            <div class="relative">
              <input
                class="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Search country by name..."
                v-model="searchQuery"
                @input="currentPage = 1"
              />
              <button
                class="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="3"
                  stroke="currentColor"
                  class="w-8 h-8 text-slate-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <TableUI
        :columns="tableColumns"
        :data="countryListPerPage"
        :sortOrder="sortOrder"
        @sort-change="onSortChange"
      >
        <template #flag="{ item }">
          <img :src="item?.flags?.png" alt="Flag" class="w-14 h-auto rounded" />
        </template>

        <template #name="{ item }">
          <span @click="openModal(item)" class="text-blue-600 cursor-pointer">
            {{ item?.name?.official }}
          </span>
        </template>

        <template #nativeName="{ item }">
          {{ item?.name?.nativeName?.eng?.official || '' }}
        </template>

        <template #altName="{ item }">
          {{ item?.altSpellings[1] || '' }}
        </template>

        <template #idd="{ item }">
          {{ renderPhoneCode(item) }}
        </template>
      </TableUI>

      <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="goToPage" />
    </div>
    <CountryModal :country="selectedCountry" :show="!!selectedCountry" @close="closeModal" />
  </div>
</template>
