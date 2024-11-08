<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  sortOrder: {
    type: String,
    default: 'asc',
  },
})

const emit = defineEmits(['sort-change'])

const handleSort = (key, sortable) => {
  if (!sortable) return
  const newSortOrder = props.sortOrder === 'asc' ? 'desc' : 'asc'
  emit('sort-change', { sortKey: key, sortOrder: newSortOrder })
}
</script>

<template>
  <div
    class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border"
  >
    <table class="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <thead class="bg-gray-200">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            @click="handleSort(col.key, col?.sortable)"
            class="p-4 border-b border-slate-300 bg-slate-50"
            :width="col?.width"
          >
            <div
              class="text-sm font-normal text-slate-500"
              :class="{ 'cursor-pointer select-none': col?.sortable }"
            >
              <span>{{ col.title }}</span>
              <b v-if="col?.sortable"> ({{ props.sortOrder === 'asc' ? '↑' : '↓' }}) </b>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.cca3" class="hover:bg-gray-100">
          <td v-for="col in columns" :key="col.key" class="px-4 py-2 border-t">
            <slot :name="col.key" :item="item">
              {{ col.key.split('.').reduce((o, k) => (o || {})[k], item) || 'N/A' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
