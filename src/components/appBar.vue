<script setup lang="ts">
import { ref } from 'vue'
import LogoutDialog from './LogoutDialog.vue'

const showDropdown = ref(false)
const showLogoutDialog = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function confirmLogout() {
  showLogoutDialog.value = true
}

</script>

<template>
  <nav class="bg-primary text-white">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">

        <!-- Logo -->
        <div class="flex flex-1">
          <div class="mr-2 bg-white text-primary w-10 h-10 flex items-center justify-center rounded-lg text-lg font-bold">
            <span style="font-size: 1.4rem;">H</span>
          </div>
            <span class="text-lg font-bold mt-1" style="font-size: 1.4rem;">Health Care</span>
        </div>

        <!-- Right side -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div class="relative ml-3">
            <button @click="toggleDropdown" type="button"
              class="flex items-center text-sm rounded-full focus:outline-none">
              <i class="mdi mdi-account-circle-outline text-3xl text-white"></i>
            </button>

            <!-- Dropdown -->
            <div v-if="showDropdown"
              class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button @click="confirmLogout"
                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                <i class="mdi mdi-logout mr-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <logout-dialog v-model="showLogoutDialog" />
</template>
