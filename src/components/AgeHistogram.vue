<script setup lang="ts">
import { ref, watch } from 'vue'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { Report } from '../types/report'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{
    reports: Report[]
}>()


const bins = [
    { label: '< 18', min: 0, max: 18 },
    { label: '18 - 25', min: 18, max: 25 },
    { label: '26 - 35', min: 26, max: 35 },
    { label: '36 - 60', min: 36, max: 60 },
    { label: '> 60', min: 60, max: Infinity }
]

const labels = bins.map((b) => b.label)
const counts = ref<number[]>(new Array(bins.length).fill(0))
const backgroundColors = ref([
  '#EF5F5D',
  '#F39AD5',
  '#FFD990',
  '#A5B4FC',
  '#31999F'
])

watch(() => props.reports, (newReports) => {
    const data = new Array(bins.length).fill(0)
    for (const r of newReports) {
        if (r.age != null) {
            const binIndex = bins.findIndex(b => r.age! >= b.min && r.age! <= b.max)
            if (binIndex >= 0) data[binIndex]++
        }
    }
    counts.value = data
}, { immediate: true })

</script>

<template>
    <div class="w-full h-[250px] lg:h-[300px] relative">
        <Bar :data="{
            labels,
            datasets: [{
                label: '',
                backgroundColor: backgroundColors,
                data: counts,
            }]
        }" :options="{
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                }
            },
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }" />
    </div>
</template>
