<script setup lang="ts">
import type { Report } from "../types/report"
defineProps<{
  report: Report[]
}>()

defineEmits<{
  (e: 'edit', index: number): void
  (e: 'delete', index: number): void
}>()
</script>
<template>
  <div class="border rounded-lg overflow-x-auto">
    <table class="w-full table-auto divide-y min-w-[700px]">
      <thead class="text-left text-text text-sm">
        <tr>
          <th class="px-4 py-2">ชื่อ-นามสกุล</th>
          <th class="px-4 py-2">อายุ</th>
          <th class="px-4 py-2">เพศ</th>
          <th class="px-4 py-2">น้ำหนัก</th>
          <th class="px-4 py-2">ส่วนสูง</th>
          <th class="px-4 py-2">จังหวัด</th>
          <th class="px-4 py-2">อำเภอ</th>
          <th class="px-4 py-2">ตำบล</th>
          <th class="px-4 py-2">โรคประจำตัว</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody v-if="report.length">
        <tr v-for="(p, i) in report" :key="p.id ?? i">
          <td class="px-4 py-2">{{ p.fullName }}</td>
          <td class="px-4 py-2">{{ p.age }}</td>
          <td class="px-4 py-2">{{ p.gender }}</td>
          <td class="px-4 py-2">{{ p.weight }}</td>
          <td class="px-4 py-2">{{ p.height }}</td>
          <td class="px-4 py-2">{{ p.province }}</td>
          <td class="px-4 py-2">{{ p.amphure }}</td>
          <td class="px-4 py-2">{{ p.tambon }}</td>
          <td class="px-4 py-2">{{ p.conditions ? p.conditions : "ไม่มี" }}</td>
          <td class="px-4 py-2 space-x-2">
            <button @click="$emit('edit', i)" class="text-text" aria-label="edit">
              <i class="mdi mdi-pencil text-lg"></i>
            </button>
            <button @click="$emit('delete', i)" class="text-red-600 hover:text-red-800" aria-label="delete">
              <i class="mdi mdi-delete text-lg"></i>
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="10" class="text-center text-gray-500 py-4">
            ไม่มีข้อมูล
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>
