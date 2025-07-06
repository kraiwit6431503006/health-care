<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogoutDialog from '../components/LogoutDialog.vue'

const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(true)
const isDesktop = ref(window.innerWidth > 768)
const showLogoutDialog = ref(false)
function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
}

function onResize() {
    isDesktop.value = window.innerWidth > 768

    if (isDesktop.value) {
        sidebarOpen.value = true
    } else {
        sidebarOpen.value = false
    }
}

onMounted(() => {
    window.addEventListener('resize', onResize)
    onResize()
})

const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'mdi-view-dashboard-outline' },
    { label: 'Data Managemant', path: '/data-management', icon: 'mdi-file-document-outline' },
]

function openLogout() {
    showLogoutDialog.value = true
}

</script>

<template>
    <div class=" h-screen">
        <!-- Overlay mobile -->
        <div v-if="sidebarOpen && !isDesktop" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="toggleSidebar">
        </div>

        <!-- Sidebar -->
        <aside :class="[
            'fixed z-50 inset-y-0 left-0 w-64 bg-white text-text flex flex-col transition-transform duration-200 ease-in-out',
            'border-r border-gray-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]">
            <div class="flex items-center px-4 py-4 h-16 space-x-3 border-b border-gray-200">
                <div
                    class="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-lg text-lg font-bold">
                    H
                </div>

                <div class="leading-tight">
                    <div class="text-lg font-bold text-gray-800">Health Care</div>
                    <div class="text-xs text-gray-500">admin</div>
                </div>
            </div>

            <nav class="flex-1 px-2 py-4 space-y-1">
                <a v-for="item in menuItems" :key="item.path" href="#" @click.prevent="router.push(item.path)" :class="[
                    'flex items-center px-4 py-2 text-sm rounded',
                    route.path === item.path ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                ]">
                    <i :class="['mdi', item.icon, 'text-lg mr-2']"></i>
                    {{ item.label }}
                </a>
            </nav>
        </aside>

        <!-- Main content -->
        <div class="flex-1 flex flex-col transition-all duration-200" :class="{
            'ml-64': isDesktop && sidebarOpen,
            'ml-0': !isDesktop || !sidebarOpen,
        }">
            <!-- Topbar -->
            <div class="flex items-center justify-between bg-primary text-white px-4 py-3 shadow">
                <div class="flex">
                    <button @click="toggleSidebar" class="text-2xl mr-2">
                        <i class="mdi mdi-menu"></i>
                    </button>
                    <span class="text-lg font-semibold mt-1" style="font-size: 1.2rem;">Health Care (Admin)</span>
                </div>
                <button @click="openLogout"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white text-primary hover:bg-gray-200 transition">
                    <i class="mdi mdi-logout text-lg"></i>
                </button>


            </div>

            <!-- Contant -->
            <slot name="main"></slot>
           
        </div>

        <logout-dialog v-model="showLogoutDialog" />
    </div>
</template>
