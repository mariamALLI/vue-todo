<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const error = ref<Error | null>(null)
const hasError = ref(false)
const router = useRouter()

onErrorCaptured((err: Error) => {
  error.value = err
  hasError.value = true
  console.error('Error caught by boundary:', err)
  return false // Prevent the error from propagating further
})

const retry = () => {
  error.value = null
  hasError.value = false
}

const goHome = ()=> {
    error.value = null
    hasError.value = false
    router.push('/')
}
</script>

<template>
  <div v-if="hasError" class="min-h-[50vh] flex items-center justify-center p-4">
    <div class="p-8 max-w-2xl w-full text-center bg-red-50 border border-red-200 rounded-lg shadow">
      <div class="mb-4">
        <svg class="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-red-800 mb-2">Oops! Something went wrong</h2>
      <p class="text-red-600 mb-4">
        {{ error?.message || 'An unexpected error occurred' }}
      </p>
      <div class="space-x-4">
        <button
          @click="retry"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Try Again
        </button>
         <button
          @click="goHome"
          class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Go Home
        </button>
      </div>
      <details class="mt-6 text-left">
        <summary class="cursor-pointer text-red-700 font-semibold">Error Details</summary>
        <pre class="mt-2 p-4 bg-red-100 rounded text-sm overflow-auto">{{ error?.stack || error }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

