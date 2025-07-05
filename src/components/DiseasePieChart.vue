<script setup lang="ts">
import { ref, watch } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Pie } from 'vue-chartjs'
import type { Report } from '../types/report'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const props = defineProps<{
    reports: Report[]
}>()

const diseaseLabels = ref<string[]>([])
const diseaseCounts = ref<number[]>([])
const backgroundColors = ref([
  '#EF5F5D',
  '#F39AD5',
  '#FFD990',
  '#A5B4FC',
  '#31999F'
])

watch(() => props.reports, (newReports) => {
    const map = new Map<string, number>()

    for (const r of newReports) {
        if (r.conditions && r.conditions.trim() !== '' && r.conditions !== 'ไม่มี') {
            const diseases = r.conditions.split(',').map(d => d.trim())
            for (const d of diseases) {
                map.set(d, (map.get(d) || 0) + 1)
            }
        }
    }

    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1])

    const topCount = 4
    const top = sorted.slice(0, topCount)
    const others = sorted.slice(topCount)

    const labels = top.map(i => i[0])
    const counts = top.map(i => i[1])

    const othersCount = others.reduce((sum, [, count]) => sum + count, 0)
    if (othersCount > 0) {
        labels.push('อื่นๆ')
        counts.push(othersCount)
    }

    diseaseLabels.value = labels
    diseaseCounts.value = counts
    if (backgroundColors.value.length < labels.length) {
    const diff = labels.length - backgroundColors.value.length
    for(let i = 0; i < diff; i++) {
      backgroundColors.value.push(backgroundColors.value[i % backgroundColors.value.length])
    }
  }
}, { immediate: true })

</script>
<template>
    <div class="grid grid-cols-12 gap-4 items-center">
        <div class="col-span-12 lg:col-span-4 md:col-span-5">
            <div class="w-full h-auto relative flex justify-center">
                <Pie :data="{
                    labels: diseaseLabels,
                    datasets: [{
                        label: 'โรคประจำตัว',
                        data: diseaseCounts,
                        backgroundColor: backgroundColors,
                    }]
                }" :options="{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        datalabels: {
                            formatter: (value, context) => {
                                const data = context.chart.data.datasets[0].data as number[]
                                const total = data.reduce((a, b) => a + b, 0)
                                const percent = ((value / total) * 100).toFixed(1)
                                return `${percent}%`
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const data = context.dataset.data as number[]
                                    const total = data.reduce((a, b) => a + b, 0)
                                    const current = context.raw as number
                                    const percent = ((current / total) * 100).toFixed(1)
                                    return `${context.label}: ${current} คน (${percent}%)`
                                }
                            }
                        }
                    }
                }" :plugins="[ChartDataLabels]" />
            </div>
        </div>
        <div class="col-span-12 lg:col-span-8 md:col-span-7">
            <ul class="text-sm text-gray-700 lg:space-y-4 space-y-2">
                <li v-for="(label, i) in diseaseLabels" :key="label" class="flex items-center justify-between">
                    <div class="flex items-center space-x-1">
                        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: backgroundColors[i] }"></div>
                        <span class="font-medium">{{ label }}: {{ diseaseCounts[i] }} คน</span>
                    </div>
                    <span>
                        {{((diseaseCounts[i] / diseaseCounts.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}}%
                    </span>
                </li>
            </ul>
        </div>



    </div>
</template>
