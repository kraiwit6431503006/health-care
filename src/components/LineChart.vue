<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { Report } from '../types/report'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

const props = defineProps<{
  reports: Report[]
}>()

const labels = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const currentYear = new Date().getFullYear()
const lastYear = currentYear - 1

const currentYearData = ref<number[]>(Array(12).fill(0))
const lastYearData = ref<number[]>(Array(12).fill(0))

watch(() => props.reports, (newReports) => {
  const current = Array(12).fill(0)
  const last = Array(12).fill(0)

  for (const report of newReports) {
    if (!report.createAt) continue
    const date = new Date(report.createAt)
    const year = date.getFullYear()
    const month = date.getMonth()

    if (year === currentYear) {
      current[month]++
    } else if (year === lastYear) {
      last[month]++
    }
  }

  currentYearData.value = current
  lastYearData.value = last
}, { immediate: true })

</script>
<template>
  <div class="w-full h-[300px] relative">
    <Line
      :data="{
        labels,
        datasets: [
          {
            label: `Last Year`,
            data: lastYearData,
            borderColor: '#A5B4FC',
            backgroundColor: '#A5B4FC',
            fill: false,
            tension: 0.3
          },
          {
            label: `This Year`,
            data: currentYearData,
            borderColor: '#31999F',
            backgroundColor: '#31999F',
            fill: false,
            tension: 0.3
          }
        ]
      }"
      :options="{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }"
    />
  </div>
</template>
