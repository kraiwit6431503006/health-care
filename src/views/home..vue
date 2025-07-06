<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import {
  createReport,
} from '../services/health.service'
import {
  loadLocations,
  getProvinces,
  getAmphures,
  getTambons
} from '../services/location.service'
import type { Report } from "../types/report";
import type { Province, Amphure, Tambon } from "../types/location";

const form = reactive<Report>({
  fullName: "",
  age: null,
  weight: null,
  height: null,
  province: null,
  amphure: null,
  tambon: null,
  gender: "",
  conditions: "",
});

const provinces = ref<Province[]>([])
const amphures = ref<Amphure[]>([])
const tambons = ref<Tambon[]>([])
const selectedProvinceName = ref('')
const selectedAmphureName = ref('')
const selectedTambonName = ref('')

onMounted(async () => {
  await loadLocations()
  provinces.value = getProvinces()
})

watch(selectedProvinceName, (name) => {
  const found = provinces.value.find(p => p.name_th === name)
  form.province = found?.name_th ?? null
  amphures.value = found ? getAmphures(found.name_th) : []
  form.amphure = null
  selectedAmphureName.value = ''
  tambons.value = []
  selectedTambonName.value = ''
})

watch(selectedAmphureName, (name) => {
  const found = amphures.value.find(a => a.name_th === name)
  form.amphure = found?.name_th ?? null
  tambons.value = found ? getTambons(found.name_th) : []
  form.tambon = null
  selectedTambonName.value = ''
})

watch(selectedTambonName, (name) => {
  const found = tambons.value.find(t => t.name_th === name)
  form.tambon = found?.name_th ?? null
})

async function handleSubmit(event: Event) {
  event.preventDefault()

  if (!form.fullName?.trim()) {
    alert("กรุณากรอกชื่อ - นามสกุล")
    return
  }
  if (form.age == null || form.age < 0) {
    alert("กรุณากรอกอายุให้ถูกต้อง")
    return
  }
  if (!form.gender?.trim()) {
    alert("กรุณาเลือกเพศ")
    return
  }
  if (form.weight == null || form.weight < 0) {
    alert("กรุณากรอกน้ำหนักให้ถูกต้อง")
    return
  }
  if (form.height == null || form.height < 0) {
    alert("กรุณากรอกส่วนสูงให้ถูกต้อง")
    return
  }
  if (!form.province?.trim()) {
    alert("กรุณาเลือกจังหวัด")
    return
  }
  if (!form.amphure?.trim()) {
    alert("กรุณาเลือกอำเภอ")
    return
  }
  if (!form.tambon?.trim()) {
    alert("กรุณาเลือกตำบล")
    return
  }

  await createReport(form)

  alert(`✅ บันทึกข้อมูลสำเร็จ: ${form.fullName}`)

  Object.assign(form, {
    fullName: '',
    age: null,
    weight: null,
    height: null,
    province: null,
    amphure: null,
    tambon: null,
    gender: "",
    conditions: ''
  })

  selectedProvinceName.value = ''
  selectedAmphureName.value = ''
  selectedTambonName.value = ''
}
</script>

<template>
  <div class="mt-2 p-6 bg-white rounded-lg shadow-sm">
    <h2 class="text-2xl font-bold mb-4 text-text">ฟอร์มบันทึกสุขภาพประชาชน</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-12 gap-4">
        <!-- ชื่อ -->
        <div class="col-span-12">
          <label class="block text-gray-700 font-medium mb-1">
            ชื่อ - นามสกุล <span class="text-error">*</span>
          </label>
          <input v-model="form.fullName" type="text" placeholder="ชื่อ - นามสกุล"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>

        <!-- อายุ -->
        <div class="col-span-6">
          <label class="block text-gray-700 font-medium mb-1">
            อายุ <span class="text-error">*</span>
          </label>
          <input v-model="form.age" type="number" min="0" placeholder="อายุ"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>

        <!-- เพศ -->
        <div class="col-span-6">
          <label class="block font-medium text-gray-700 mb-1">
            เพศ <span class="text-error">*</span>
          </label>
          <div class="relative">
            <select v-model="form.gender" required
              class="appearance-none w-full bg-white dark:bg-gray-800 text-gray-900 border border-gray-300 rounded-md px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="" disabled selected hidden>เลือกเพศ</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
              <option value="อื่น ๆ">อื่น ๆ</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- น้ำหนัก -->
        <div class="col-span-6">
          <label class="block text-gray-700 font-medium mb-1">
            น้ำหนัก (kg) <span class="text-error">*</span>
          </label>
          <input v-model="form.weight" placeholder="น้ำหนัก" type="number" step="0.1" min="0"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>

        <!-- ส่วนสูง -->
        <div class="col-span-6">
          <label class="block text-gray-700 font-medium mb-1">
            ส่วนสูง (cm) <span class="text-error">*</span>
          </label>
          <input v-model="form.height" type="number" placeholder="ส่วนสูง" step="0.1" min="0"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>

        <!-- จังหวัด -->
        <div class="col-span-12 md:col-span-4">
          <label class="block text-gray-700 font-medium mb-1">
            จังหวัด <span class="text-error">*</span>
          </label>
          <input list="provinceList" v-model="selectedProvinceName"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="เลือกหรือพิมพ์จังหวัด" required />
          <datalist id="provinceList">
            <option v-for="p in provinces" :key="p.id" :value="p.name_th" />
          </datalist>
        </div>

        <!-- อำเภอ -->
        <div class="col-span-12 md:col-span-4">
          <label class="block text-gray-700 font-medium mb-1">
            อำเภอ <span class="text-error">*</span>
          </label>
          <input list="amphureList" v-model="selectedAmphureName" :disabled="!amphures.length" required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="เลือกหรือพิมพ์อำเภอ" />
          <datalist id="amphureList">
            <option v-for="a in amphures" :key="a.id" :value="a.name_th" />
          </datalist>
        </div>

        <!-- ตำบล -->
        <div class="col-span-12 md:col-span-4">
          <label class="block text-gray-700 font-medium mb-1">
            ตำบล <span class="text-error">*</span>
          </label>
          <input list="tambonList" v-model="selectedTambonName" :disabled="!tambons.length" required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="เลือกหรือพิมพ์ตำบล" />
          <datalist id="tambonList">
            <option v-for="t in tambons" :key="t.id" :value="t.name_th" />
          </datalist>
        </div>

        <!-- โรคประจำตัว -->
        <div class="col-span-12">
          <label class="block text-gray-700 font-medium mb-1">โรคประจำตัว (ถ้ามี)</label>
          <textarea v-model="form.conditions"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" rows="3"
            placeholder="เช่น เบาหวาน, ความดันโลหิตสูง"></textarea>
        </div>
      </div>

      <!-- ปุ่มบันทึก -->
      <div class="text-right">
        <button type="submit" class="bg-primary text-white font-semibold px-4 py-2 rounded-md">
          บันทึกข้อมูล
        </button>
      </div>
    </form>
  </div>
</template>
