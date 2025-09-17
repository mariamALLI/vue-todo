<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

onMounted(() => {
  document.title = 'Welcome | My Todo App';
  // If you want meta tags, use vue-meta or @vueuse/head
});
</script>

<template>
  <div
    class="h-[50vh] flex flex-col justify-center items-center bg-transparent p-3 text-center"
  >
    <h1
      class="text-4xl font-bold font-serif mb-4"
      style="background: linear-gradient(135deg,rgb(242, 88, 204) 0%,rgb(67, 8, 109) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: #9f54d6"
    >
      Welcome to My Todo App
    </h1>
    <div class="flex flex-col items-center mt-2 space-y-2">
      <button
        class="bg-[#7127b5] text-white font-serif text-lg px-6 py-3 font-bold rounded hover:bg-[#551c89]"
        @click="router.push('/todos')"
      >
        Start Curating Your Todo List
      </button>
      <router-link
        to="/test-error"
        class="border border-red-600 text-red-600 px-4 py-2 rounded font-serif hover:bg-red-50"
      >
        Test Error Boundary
      </router-link>
      <router-link
        to="/non-existent-page"
        class="border border-purple-600 text-purple-600 px-4 py-2 rounded font-serif hover:bg-purple-50"
      >
        Test 404 Page
      </router-link>
    </div>
  </div>
</template>
