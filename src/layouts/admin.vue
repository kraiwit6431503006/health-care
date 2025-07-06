<script setup lang="ts">
import appBar from '../components/appBarAdmin.vue';
</script>
<template>
    <app-bar>
        <template #main>
            <main className="flex-grow w-full">
                <div className="max-w-6xl mx-auto p-2">
                    <router-view />
                </div>
            </main>
        </template>
    </app-bar>
</template>