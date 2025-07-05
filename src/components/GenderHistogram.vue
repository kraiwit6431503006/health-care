<script setup lang="ts">
import { ref, watch } from 'vue'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface Report {
    gender?: string | null
}

const props = defineProps<{ reports: Report[] }>()

const genderLabels = ref<string[]>([])
const genderCounts = ref<number[]>([])
const backgroundColors = ['#92BFFF', '#F39AD5', '#A5B4FC']

watch(() => props.reports, (newReports) => {
    const map = new Map<string, number>()

    for (const r of newReports) {
        const g = (r.gender?.toLowerCase() ?? 'unknown')
        map.set(g, (map.get(g) || 0) + 1)
    }

    const order = ['ชาย', 'หญิง', 'อื่นๆ', 'unknown']

    const labels: string[] = []
    const counts: number[] = []

    for (const key of order) {
        if (map.has(key)) {
            labels.push(key.charAt(0).toUpperCase() + key.slice(1))
            counts.push(map.get(key)!)
        }
    }

    genderLabels.value = labels
    genderCounts.value = counts
}, { immediate: true })
</script>

<template>
    <div class="w-full h-[250px] lg:h-[200px] relative">
        <Bar :data="{
            labels: genderLabels,
            datasets: [{
                label: '',
                data: genderCounts,
                backgroundColor: backgroundColors.slice(0, genderLabels.length),
            }]
        }" :options="{
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            return `${ctx.label}: ${ctx.raw} คน`
                        }
                    }
                }
            },
            
        }" />
    </div>
</template>
