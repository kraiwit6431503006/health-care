<script setup lang="ts">
import { ref } from 'vue'

const sidebarOpen = ref(false)
const dropdownOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Overlay (mobile only) -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      v-if="sidebarOpen"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed md:static z-50 md:z-auto inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col transform transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      ]"
    >
      <div class="flex items-center justify-center h-16 shadow-md text-lg font-bold">
        Health Care
      </div>

      <nav class="flex-1 px-2 py-4 space-y-1">
        <a href="#" class="flex items-center px-4 py-2 text-sm hover:bg-gray-700 rounded">
          <i class="mdi mdi-form-select text-lg mr-2"></i> Form
        </a>
        <a href="#" class="flex items-center px-4 py-2 text-sm hover:bg-gray-700 rounded">
          <i class="mdi mdi-account text-lg mr-2"></i> Profile
        </a>
      </nav>

      <div class="p-4 border-t border-gray-700">
        <button @click="toggleDropdown" class="w-full flex items-center space-x-2 text-left">
          <i class="mdi mdi-account-circle-outline text-2xl"></i>
          <span class="text-sm">Account</span>
        </button>

        <div v-if="dropdownOpen" class="mt-2 bg-white text-gray-800 rounded shadow-md">
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Your Profile</a>
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Sign out</a>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar (mobile) -->
      <div class="md:hidden flex items-center justify-between bg-gray-800 text-white px-4 py-3 shadow">
        <button @click="toggleSidebar" class="text-2xl">
          <i class="mdi mdi-menu"></i>
        </button>
        <span class="text-lg font-semibold">Health Care</span>
        <i class="mdi mdi-account-circle-outline text-2xl"></i>
      </div>

      <!-- Router View or main -->
      <main class="flex-1 p-6 overflow-y-auto">
        <h1 class="text-2xl font-semibold text-gray-800">Main Content</h1>
        <!-- <router-view /> -->
      </main>
    </div>
  </div>
</template>
