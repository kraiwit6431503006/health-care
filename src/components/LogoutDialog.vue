<script setup lang="ts">
import { useRouter } from 'vue-router'

const show = defineModel<boolean>({ required: true })
const router = useRouter()

function logout() {
    localStorage.removeItem('user')
    show.value = false
    router.push('/login')
}
</script>

<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white text-text rounded-lg p-6 w-full max-w-sm shadow-lg mr-2 ml-2">
            <h2 class="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p class="mb-4">Are you sure you want to log out?</p>
            <div class="flex justify-end space-x-2">
                <button @click="show = false" class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-400">
                    Cancel
                </button>
                <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Log Out
                </button>
            </div>
        </div>
    </div>
</template>
