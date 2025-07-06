<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p class="text-gray-500 mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <router-link
        to="/"
        class="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
      >
        Go to Home
      </router-link>
    </div>
  </div>
</template>

