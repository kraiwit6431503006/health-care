<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import {
  loadLocations,
  getProvinces,
  getAmphures,
  getTambons,
} from "../services/location.service";
import type { Province, Amphure, Tambon } from "../types/location";

interface Props {
  visible: boolean;
  modelValue: {
    fullName?: string | null;
    age?: number | null;
    weight?: number | null;
    height?: number | null;
    gender?: string | null;
    province?: string | null;
    amphure?: string | null;
    tambon?: string | null;
    conditions?: string;
  };
  isEdit: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "submit", "cancel"]);

const formData = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (newVal) => Object.assign(formData, newVal),
  { deep: true }
);

const provinces = ref<Province[]>([]);
const amphures = ref<Amphure[]>([]);
const tambons = ref<Tambon[]>([]);

const selectedProvinceName = ref<string>(props.modelValue.province || "");
const selectedAmphureName = ref<string>(props.modelValue.amphure || "");
const selectedTambonName = ref<string>(props.modelValue.tambon || "");

onMounted(async () => {
  await loadLocations();
  provinces.value = getProvinces();
});

watch(selectedProvinceName, (name) => {
  const found = provinces.value.find((p) => p.name_th === name);
  formData.province = found?.name_th ?? "";
  amphures.value = found ? getAmphures(found.name_th) : [];
  formData.amphure = "";
  selectedAmphureName.value = "";
  tambons.value = [];
  selectedTambonName.value = "";
});

watch(selectedAmphureName, (name) => {
  const found = amphures.value.find((a) => a.name_th === name);
  formData.amphure = found?.name_th ?? "";
  tambons.value = found ? getTambons(found.name_th) : [];
  formData.tambon = "";
  selectedTambonName.value = "";
});

watch(selectedTambonName, (name) => {
  const found = tambons.value.find((t) => t.name_th === name);
  formData.tambon = found?.name_th ?? "";
});

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(formData, newVal);
    selectedProvinceName.value = newVal.province || "";
    selectedAmphureName.value = newVal.amphure || "";
    selectedTambonName.value = newVal.tambon || "";
  },
  { deep: true }
);

function resetForm() {
  Object.assign(formData, {
    fullName: "",
    age: null,
    weight: null,
    height: null,
    gender: "",
    province: "",
    amphure: "",
    tambon: "",
    conditions: "",
  });

  selectedProvinceName.value = "";
  selectedAmphureName.value = "";
  selectedTambonName.value = "";
}

function onSubmit() {
  emit("submit", { ...formData });
}
</script>
<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-lg
           flex flex-col mr-2 ml-2
           max-h-[90vh] sm:max-h-[80vh]">
      <div class="border-b border-gray-200 p-6">
        <h3 class="text-xl font-bold text-primary">
          {{ isEdit ? "Edit" : "Create" }}
        </h3>
      </div>
      <form @submit.prevent="onSubmit" class="flex flex-col flex-1 overflow-hidden">
        <div class="p-6 overflow-y-auto flex-1" style="min-height: 0;">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
              <label class="block text-gray-700 dark:text-gray-300">ชื่อ - นามสกุล <span class="text-error">*</span> </label>
              <input v-model="formData.fullName" placeholder="ชื่อ - นามสกุล" class="w-full px-3 py-2 border rounded" required />
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block text-gray-700 dark:text-gray-300">อายุ <span class="text-error">*</span> </label>
              <input type="number" placeholder="อายุ" v-model.number="formData.age" class="w-full px-3 py-2 border rounded" required />
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block text-gray-700 dark:text-gray-300">เพศ <span class="text-error">*</span> </label>
              <select v-model="formData.gender" class="w-full px-3 py-2 border rounded" required>
                <option value="" disabled selected hidden>เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
              </select>
            </div>

            <div class="col-span-6">
              <label class="block text-gray-700 dark:text-gray-300">น้ำหนัก (kg) <span class="text-error">*</span> </label>
              <input type="number" v-model.number="formData.weight" placeholder="น้ำหนัก" required class="w-full px-3 py-2 border rounded" />
            </div>

            <div class="col-span-6">
              <label class="block text-gray-700 dark:text-gray-300">ส่วนสูง (cm) <span class="text-error">*</span></label>
              <input type="number" v-model.number="formData.height" placeholder="ส่วนสูง" required class="w-full px-3 py-2 border rounded" />
            </div>

            <div class="col-span-12">
              <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1">จังหวัด <span class="text-error">*</span> </label>
              <input list="provinceList" v-model="selectedProvinceName"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="เลือกหรือพิมพ์จังหวัด" required />
              <datalist id="provinceList">
                <option v-for="p in provinces" :key="p.id" :value="p.name_th" />
              </datalist>
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1">อำเภอ <span class="text-error">*</span> </label>
              <input list="amphureList"  v-model="selectedAmphureName" :disabled="!amphures.length" required
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="เลือกหรือพิมพ์อำเภอ" />
              <datalist id="amphureList">
                <option v-for="a in amphures" :key="a.id" :value="a.name_th" />
              </datalist>
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1">ตำบล <span class="text-error">*</span> </label>
              <input list="tambonList" v-model="selectedTambonName" :disabled="!tambons.length" required
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="เลือกหรือพิมพ์ตำบล" />
              <datalist id="tambonList">
                <option v-for="t in tambons" :key="t.id" :value="t.name_th" />
              </datalist>
            </div>
            <div class="col-span-12">
              <label class="block text-gray-700 dark:text-gray-300">โรคประจำตัว (กรณีมีโรคประจำตัว)</label>
              <textarea v-model="formData.conditions" placeholder="เช่น เบาหวาน, ความดันโลหิตสูง" class="w-full px-3 py-2 border rounded"></textarea>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-200 p-6">
          <div class="flex justify-end space-x-2">
            <button type="button" @click="() => { resetForm(); emit('cancel'); }" class="px-4 py-2 border rounded">
              cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded">
              {{ isEdit ? "Update" : "Save" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
