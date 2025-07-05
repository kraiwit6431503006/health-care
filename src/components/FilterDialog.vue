<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import {
    loadLocations,
    getProvinces,
    getAmphures,
    getTambons,
} from "../services/location.service"
import type { Province, Amphure, Tambon } from "../types/location"

const props = defineProps<{ visible: boolean, required: string[] }>()
const emit = defineEmits(['close', 'apply'])

const filters = reactive({
    fullName: '',
    province: '',
    amphure: '',
    tambon: '',
    gender: [] as string[],
    minAge: null,
    maxAge: null,
    minWeight: null,
    maxWeight: null,
    minHeight: null,
    maxHeight: null,
    startDate: null as string | null,
    endDate: null as string | null,
    conditionsRaw: '',
})

const provinces = ref<Province[]>([])
const amphures = ref<Amphure[]>([])
const tambons = ref<Tambon[]>([])

const selectedProvinceName = ref<string>("")
const selectedAmphureName = ref<string>("")
const selectedTambonName = ref<string>("")

onMounted(async () => {
    await loadLocations();
    provinces.value = await getProvinces()
})

watch(selectedProvinceName, async (name) => {
    filters.province = name
    const found = provinces.value.find(p => p.name_th === name)
    if (found) {
        amphures.value = await getAmphures(found.name_th)
    } else {
        amphures.value = []
    }
    filters.amphure = ""
    filters.tambon = ""
    selectedAmphureName.value = ""
    selectedTambonName.value = ""
})

watch(selectedAmphureName, async (name) => {
    filters.amphure = name
    const found = amphures.value.find(a => a.name_th === name)
    if (found) {
        tambons.value = await getTambons(found.name_th)
    } else {
        tambons.value = []
    }
    filters.tambon = ""
    selectedTambonName.value = ""
})

watch(selectedTambonName, (name) => {
    filters.tambon = name
})

function applyFilter() {
    const appliedConditions = filters.conditionsRaw
        .split(',')
        .map(c => c.trim())
        .filter(Boolean);

    emit('apply', {
        ...filters,
        conditions: appliedConditions,
        gender: [...filters.gender],
    });

    emit('close');
}

</script>

<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-lg
           flex flex-col mr-2 ml-2
           max-h-[90vh] sm:max-h-[80vh]">

            <div class="border-b border-gray-200 p-6">
                <div class="text-lg font-semibold text-primary">
                    <i class="mdi mdi-filter-variant mr-2 text-base"></i>Filter Data
                </div>
            </div>

            <form @submit.prevent="applyFilter" class="flex flex-col flex-1 overflow-hidden">
                <div class="p-6 overflow-y-auto flex-1" style="min-height: 0;">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12" v-if="props.required?.includes('fullName')">
                            <label class="block text-sm font-medium text-gray-700">ชื่อ</label>
                            <input v-model="filters.fullName" type="text" class="w-full border rounded px-3 py-2"
                                placeholder="ชื่อ - นามสกุล" />
                        </div>
                        <div class="col-span-12" v-if="props.required?.includes('olds')">
                            <label class="block text-sm font-medium text-gray-700 mb-1">อายุระหว่าง</label>
                            <div class="flex space-x-2">
                                <input v-model.number="filters.minAge" type="number" min="0"
                                    class="w-full border rounded px-3 py-2" placeholder="ต่ำสุด" />
                                <span class="self-center">-</span>
                                <input v-model.number="filters.maxAge" type="number" min="0"
                                    class="w-full border rounded px-3 py-2" placeholder="สูงสุด" />
                            </div>
                        </div>

                        <div class="col-span-12" v-if="props.required?.includes('gender')">
                            <label class="block text-sm font-medium text-gray-700 mb-1">เพศ</label>
                            <div class="flex space-x-4 mt-2">
                                <label
                                    class="inline-flex items-center px-3 py-1 border rounded-lg cursor-pointer transition-colors duration-150"
                                    :class="{
                                        'bg-primary text-white border-primary': filters.gender.includes('ชาย'),
                                        'bg-white text-gray-700 border-gray-300': !filters.gender.includes('ชาย')
                                    }">
                                    <input type="checkbox" value="ชาย" v-model="filters.gender" class="hidden" />
                                    <span>ชาย</span>
                                </label>

                                <label
                                    class="inline-flex items-center px-3 py-1 border rounded-lg cursor-pointer transition-colors duration-150"
                                    :class="{
                                        'bg-primary text-white border-primary': filters.gender.includes('หญิง'),
                                        'bg-white text-gray-700 border-gray-300': !filters.gender.includes('หญิง')
                                    }">
                                    <input type="checkbox" value="หญิง" v-model="filters.gender" class="hidden" />
                                    <span>หญิง</span>
                                </label>

                                <label
                                    class="inline-flex items-center px-3 py-1 border rounded-lg cursor-pointer transition-colors duration-150"
                                    :class="{
                                        'bg-primary text-white border-primary': filters.gender.includes('อื่นๆ'),
                                        'bg-white text-gray-700 border-gray-300': !filters.gender.includes('อื่นๆ')
                                    }">
                                    <input type="checkbox" value="อื่นๆ" v-model="filters.gender" class="hidden" />
                                    <span>อื่นๆ</span>
                                </label>
                            </div>
                        </div>

                        <div class="col-span-12" v-if="props.required?.includes('weight')">
                            <label class="block text-sm font-medium text-gray-700 mb-1">น้ำหนักระหว่าง (กก.)</label>
                            <div class="flex space-x-2">
                                <input v-model.number="filters.minWeight" type="number" min="0"
                                    class="w-full border rounded px-3 py-2" placeholder="ต่ำสุด" />
                                <span class="self-center">-</span>
                                <input v-model.number="filters.maxWeight" type="number" min="0"
                                    class="w-full border rounded px-3 py-2" placeholder="สูงสุด" />
                            </div>
                        </div>
                        <div class="col-span-12" v-if="props.required?.includes('height')">
                            <label class="block text-sm font-medium text-gray-700 mb-1">ส่วนสูงระหว่าง (ซม.)</label>
                            <div class="flex space-x-2">
                                <input v-model.number="filters.minHeight" type="number" min="0"
                                    class="w-full border rounded px-3 py-2" placeholder="ต่ำสุด" />
                                <span class="self-center">-</span>
                                <input v-model.number="filters.maxHeight" type="number" min="0"
                                    class="w-full border rounded px-3 py-2" placeholder="สูงสุด" />
                            </div>
                        </div>

                        <div class="col-span-12" v-if="props.required?.includes('provinces')">
                            <label class="block text-sm font-medium text-gray-700">จังหวัด</label>
                            <input list="provinceList" v-model="selectedProvinceName"
                                class="w-full border rounded px-3 py-2" placeholder="เลือกหรือพิมพ์จังหวัด" />
                            <datalist id="provinceList">
                                <option v-for="p in provinces" :key="p.id" :value="p.name_th" />
                            </datalist>
                        </div>

                        <div class="col-span-12" v-if="props.required?.includes('provinces')">
                            <label class="block text-sm font-medium text-gray-700">อำเภอ</label>
                            <input list="amphureList" v-model="selectedAmphureName" :disabled="!amphures.length"
                                class="w-full border rounded px-3 py-2" placeholder="เลือกหรือพิมพ์อำเภอ" />
                            <datalist id="amphureList">
                                <option v-for="a in amphures" :key="a.id" :value="a.name_th" />
                            </datalist>
                        </div>

                        <div class="col-span-12" v-if="props.required?.includes('provinces')">
                            <label class="block text-sm font-medium text-gray-700">ตำบล</label>
                            <input list="tambonList" v-model="selectedTambonName" :disabled="!tambons.length"
                                class="w-full border rounded px-3 py-2" placeholder="เลือกหรือพิมพ์ตำบล" />
                            <datalist id="tambonList">
                                <option v-for="t in tambons" :key="t.id" :value="t.name_th" />
                            </datalist>
                        </div>

                        <div class="col-span-12" v-if="props.required?.includes('condition')">
                            <label class="block text-sm font-medium text-gray-700 mb-1">โรคประจำตัว
                                (โปรดกรอกข้อมูลตามตัวอย่าง)</label>
                            <input v-model="filters.conditionsRaw" type="text"
                                placeholder="เช่น เบาหวาน, ความดัน, หอบหืด" class="w-full border rounded px-3 py-2" />

                        </div>
                        
                        <div class="col-span-12" v-if="props.required?.includes('date')">
                            <label class="block text-sm font-medium text-gray-700 mb-1">ช่วงวันที่</label>
                            <div class="grid grid-cols-12 gap-2">
                                <div class="col-span-6">
                                    <input type="date" v-model="filters.startDate"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="วันที่เริ่มต้น" />
                                </div>
                                <div class="col-span-6">
                                    <input type="date" v-model="filters.endDate"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="วันที่สิ้นสุด" />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="border-t border-gray-200 p-6">
                    <div class="flex justify-end space-x-2">
                        <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-primary text-white rounded">Apply</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
