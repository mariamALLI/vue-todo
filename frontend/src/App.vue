<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <UApp>
    <div class="min-h-screen" style="background: linear-gradient(135deg, #e0cbda 0%, #9f54d6 100%)">
    <NavBar />
    <RouterView />
    </div>
  </UApp>
</template>

<style scoped></style>
