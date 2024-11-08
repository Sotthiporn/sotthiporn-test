<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
})

const emit = defineEmits(['page-change'])

const goToPreviousPage = () => {
  if (props.currentPage > 1) emit('page-change', props.currentPage - 1)
}

const goToNextPage = () => {
  if (props.currentPage < props.totalPages) emit('page-change', props.currentPage + 1)
}

const goToPage = (page) => {
  emit('page-change', page)
}

const maxDisplayPage = 5
const displayPages = computed(() => {
  const half = Math.floor(maxDisplayPage / 2)
  let start = Math.max(props.currentPage - half, 1)
  let end = Math.min(start + maxDisplayPage - 1, props.totalPages)

  if (end - start + 1 < maxDisplayPage) {
    start = Math.max(end - maxDisplayPage + 1, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
  <div class="flex justify-center items-center space-x-1 mt-4">
    <button
      @click="goToPreviousPage"
      :disabled="props.currentPage === 1"
      class="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
    >
      Prev
    </button>

    <button
      @click="goToPage(1)"
      :disabled="props.currentPage === 1"
      class="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
    >
      First
    </button>

    <button
      v-for="page in displayPages"
      :key="page"
      class="min-w-9 rounded-full py-2 px-3.5 border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none hover:text-white ml-2"
      :class="{
        'bg-slate-700 text-white': props.currentPage === page,
        'text-dark': props.currentPage === page,
      }"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      @click="goToPage(props.totalPages)"
      :disabled="props.currentPage === props.totalPages"
      class="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
    >
      Last
    </button>

    <button
      @click="goToNextPage"
      :disabled="props.currentPage === props.totalPages"
      class="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-700 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
    >
      Next
    </button>
  </div>
</template>
