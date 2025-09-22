<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();
const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();
</script>

<template>
  <div class="flex justify-between mt-4" role="navigation" aria-label="Pagination">
    <button
      @click="emit('page-change', props.currentPage - 1)"
      :disabled="props.currentPage === 1"
      :aria-label="`Go to page ${props.currentPage - 1}`"
      :class="[
        'px-4 py-2 rounded-md text-white font-serif',
        props.currentPage === 1
          ? 'bg-gray-300 px-10 py-2 rounded-md cursor-not-allowed'
          : 'bg-purple-700 hover:bg-red-400 px-10 py-2 rounded-md font-bold cursor-pointer'
      ]"
    >
      Previous
    </button>
    <button
      @click="emit('page-change', props.currentPage + 1)"
      :disabled="props.currentPage >= props.totalPages"
      :aria-label="`Go to page ${props.currentPage + 1}`"
      :class="[
        'px-4 py-2 rounded-md text-white font-serif',
        props.currentPage >= props.totalPages
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-purple-700 hover:bg-[#551c89] px-12 py-2 rounded-md font-bold cursor-pointer'
      ]"
    >
      Next
    </button>
  </div>
</template>
