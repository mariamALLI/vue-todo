<script setup lang="ts">
import { ref } from 'vue';
import { useHead } from '@vueuse/head';

useHead({
  title: 'Error Boundary Test | My Todo App',
  meta: [
    { name: 'description', content: 'Test the error boundary by triggering an error on this page.' }
  ]
});

const error = ref(false);

if (error.value) {
  throw new Error('This is a test error to demonstrate the error boundary');
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4">
    <div class="p-8 max-w-2xl w-full text-center bg-white rounded shadow">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 leading-right bg-clip-text text-transparent">
        Error Boundary Test Page
      </h1>
      <p class="mb-2 text-gray-700">
        This page demonstrates how the Error Boundary component works. Click the button below to trigger an error.
      </p>
      <button
        @click="error = true"
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Trigger Error
      </button>
    </div>
  </div>
</template>
