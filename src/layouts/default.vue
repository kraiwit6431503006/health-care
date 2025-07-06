<script setup lang="ts">
import AppBar from "../components/appBar.vue";
</script>
<template>
   <div className="min-h-screen w-full flex flex-col bg-white">
      <app-bar />

      <main className="flex-grow w-full bg-gray-100 dark:bg-black">
         <div className="max-w-6xl mx-auto p-2">
            <router-view />
         </div>
      </main>
   </div>
</template>