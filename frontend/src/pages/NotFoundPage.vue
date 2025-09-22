<template>
  <section class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-6xl font-bold text-gray-800 mb-4 font-serif bg-gradient-to-r from-purple-700 to-pink-600 leading-right bg-clip-text text-transparent">404</h1>
      <h2 class="text-2xl font-semibold text-gray-600 mb-4 font-serif bg-gradient-to-r from-purple-700 to-pink-600 leading-right bg-clip-text text-transparent">Page Not Found</h2>
      <p class="text-gray-500 mb-6 font-serif text-xl">The page you're looking for doesn't exist or has been moved.</p>
      <router-link
        to="/"
        class="inline-block bg-purple-900 text-white px-6 py-2 rounded-md hover:bg-purple-600 font-serif"
      >
        Go Back Home
      </router-link>
    </div>
  </section>
</template>
