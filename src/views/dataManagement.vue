<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import HealthDialog from "../components/HealthDialog.vue";
import FilterDialog from "../components/FilterDialog.vue";
import HealthTable from "../components/HealthTable.vue";
import type { Report } from "../types/report";
import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} from "../services/health.service";

const reports = ref<Report[]>([]);
const showDialog = ref(false);
const isEdit = ref(false);
const currentIndex = ref<number | null>(null);

const currentForm = reactive<Report>({});

const dropdownOpen = ref(false);
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function openCreateDialog() {
  Object.assign(currentForm, {
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
  dropdownOpen.value = false;
  isEdit.value = false;
  showDialog.value = true;
}

function openEditDialog(index: number) {
  currentIndex.value = index;
  Object.assign(currentForm, reports.value[index]);
  isEdit.value = true;
  showDialog.value = true;
}

async function fetchReports() {
  reports.value = await getReports();
}

onMounted(fetchReports);

async function handleSubmit(data: Report) {
  if (isEdit.value && data.id) {
    await updateReport(data.id, data);
  } else {
    await createReport(data);
  }

  await fetchReports();
  showDialog.value = false;
}

async function deletePerson(index: number) {
  const person = reports.value[index];
  if (person.id && confirm("ยืนยันการลบ?")) {
    await deleteReport(person.id);
    await fetchReports();
  }
}

const itemsPerPage = 10;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(filteredPeople.value.length / itemsPerPage)
);

const paginatedReport = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPeople.value.slice(start, start + itemsPerPage);
});

function goToNextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function goToPreviousPage() {
  if (currentPage.value > 1) currentPage.value--;
}

const filterDialogVisible = ref(false);

function openFilterDialog() {
  filterDialogVisible.value = true;
}

const appliedFilters = ref<{
  fullName?: string;
  province?: string;
  amphure?: string;
  tambon?: string;
  minAge?: number | null;
  maxAge?: number | null;
  gender?: string[];
  minWeight?: number | null;
  maxWeight?: number | null;
  minHeight?: number | null;
  maxHeight?: number | null;
  conditions?: string[];
  startDate?: string | null,
  endDate?: string | null,
}>({});

function applyFilters(filters: any) {
  appliedFilters.value = filters;
  currentPage.value = 1;
}
const searchTerm = ref("");

const filteredPeople = computed(() => {
  return reports.value.filter((report) => {
    const nameSearch = report.fullName
      ? report.fullName.toLowerCase().includes(searchTerm.value.toLowerCase())
      : false;

    const nameMatch = appliedFilters.value.fullName
      ? report.fullName?.toLowerCase().includes(appliedFilters.value.fullName.toLowerCase()) ?? false
      : true;


    const provinceMatch = appliedFilters.value.province
      ? report.province === appliedFilters.value.province
      : true;

    const amphureMatch = appliedFilters.value.amphure
      ? report.amphure === appliedFilters.value.amphure
      : true;

    const tambonMatch = appliedFilters.value.tambon
      ? report.tambon === appliedFilters.value.tambon
      : true;

    const gender = report.gender ?? '';
    const genderMatch = appliedFilters.value.gender?.length
      ? appliedFilters.value.gender.includes(gender)
      : true;

    const createDate = report.createAt ? new Date(report.createAt) : null;
    const start = appliedFilters.value.startDate ? new Date(appliedFilters.value.startDate) : null;
    const end = appliedFilters.value.endDate ? new Date(appliedFilters.value.endDate) : null;

    const dateMatch =
      (!start || (createDate && createDate >= start)) &&
      (!end || (createDate && createDate <= end));

    const ageMatch =
      (appliedFilters.value.minAge == null || (report.age != null && report.age >= appliedFilters.value.minAge)) &&
      (appliedFilters.value.maxAge == null || (report.age != null && report.age <= appliedFilters.value.maxAge));

    const weightMatch =
      (appliedFilters.value.minWeight == null || (report.weight != null && report.weight >= appliedFilters.value.minWeight)) &&
      (appliedFilters.value.maxWeight == null || (report.weight != null && report.weight <= appliedFilters.value.maxWeight));

    const heightMatch =
      (appliedFilters.value.minHeight == null || (report.height != null && report.height >= appliedFilters.value.minHeight)) &&
      (appliedFilters.value.maxHeight == null || (report.height != null && report.height <= appliedFilters.value.maxHeight));

    const conditionsMatch = appliedFilters.value.conditions?.length
      ? appliedFilters.value.conditions.some((c: string) =>
        report.conditions?.toLowerCase().includes(c.toLowerCase()) ?? false
      )
      : true;
    return (
      nameSearch &&
      nameMatch &&
      provinceMatch &&
      amphureMatch &&
      tambonMatch &&
      ageMatch &&
      genderMatch &&
      weightMatch &&
      heightMatch &&
      conditionsMatch &&
      dateMatch
    );
  });
});

function downloadCSV() {
  if (!filteredPeople.value.length) {
    alert("ไม่มีข้อมูลสำหรับดาวน์โหลด");
    return;
  }

  const headers = ["Full Name", "Age", "Gender", "Weight", "Height", "Province", "Amphure", "Tambon", "Conditions"];

  const rows = filteredPeople.value.map(report => [
    `"${report.fullName}"`,
    report.age ?? "",
    report.gender ?? "",
    report.weight ?? "",
    report.height ?? "",
    `"${report.province ?? ""}"`,
    `"${report.amphure ?? ""}"`,
    `"${report.tambon ?? ""}"`,
    `"${report.conditions}"`,
  ].join(","));

  const csvContent = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `health_data_${new Date().toISOString()}.csv`);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  dropdownOpen.value = false;
}

</script>

<template>
  <div class="mt-2 p-6 bg-white border rounded-lg shadow-sm ">

    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-8 md:col-span-4 order-1 md:order-1">
        <h2 class="text-2xl font-bold text-primary">Data Form</h2>
      </div>
      <div class="col-span-8 md:col-span-4 order-3 md:order-2">
        <input v-model="searchTerm" type="text" placeholder="Search name..."
          class="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring focus:ring-primary focus:outline-none" />
      </div>
      <div class="col-span-4 md:col-span-2 order-4 md:order-3">
        <button @click="openFilterDialog" type="button"
          class="rounded-lg mr-2 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-primary hover:text-white focus:outline-none">
          <i class="mdi mdi-filter-variant mr-2 text-base"></i>
          Filter
        </button>
      </div>
      <div class="col-span-4 md:col-span-2 order-2 md:order-4 relative">
        <button @click="toggleDropdown" type="button"
          class="inline-flex justify-center w-full space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-text hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
          <span>Options</span>
          <i class="mdi mdi-menu-down text-base"></i>
        </button>
        <div v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white text-gray-800 shadow-lg ring-1 ring-black/5"
          style="top: 100%; z-index: 9999">
          <button @click="openCreateDialog"
            class="flex items-center w-full px-4 py-2 text-sm hover:bg-primary hover:text-white space-x-2">
            <i class="mdi mdi-plus-box-outline"></i>
            <span>Add data</span>
          </button>
          <button @click="downloadCSV"
            class="flex w-full items-center px-4 py-2 text-sm hover:bg-primary hover:text-white space-x-2">
            <i class="mdi mdi-download"></i>
            <span>Downloads CSV</span>
          </button>
        </div>
      </div>
    </div>

    <!-- component table -->
    <HealthTable :report="paginatedReport" @edit="openEditDialog" @delete="deletePerson" />

    <div class="mt-4 flex justify-between  gap-2 text-sm text-gray-700 dark:text-gray-200">
      <div class="text-center md:text-left mt-3">
        Page {{ currentPage }} of {{ totalPages }} |
        <span class="font-medium">Total: {{ filteredPeople.length }}</span> items
      </div>

      <div class="flex justify-center md:justify-end space-x-2">
        <button class="w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50"
          :disabled="currentPage === 1" @click="goToPreviousPage">
          <i class="mdi mdi-chevron-left text-2xl"
            :class="{ 'text-primary': currentPage !== 1, 'text-gray-400': currentPage === 1 }"></i>
        </button>

        <button class="w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50"
          :disabled="currentPage === totalPages" @click="goToNextPage">
          <i class="mdi mdi-chevron-right text-2xl"
            :class="{ 'text-primary': currentPage !== totalPages, 'text-gray-400': currentPage === totalPages }"></i>
        </button>
      </div>

    </div>

    <filter-dialog :visible="filterDialogVisible"
      :required="['date', 'gender', 'provinces', 'weight', 'olds', 'height', 'fullName', 'weight', 'condition']"
      @close="filterDialogVisible = false" @apply="applyFilters" />

    <health-dialog v-if="showDialog" :visible="showDialog" :model-value="currentForm" :is-edit="isEdit"
      @submit="handleSubmit" @cancel="showDialog = false" />
  </div>
</template>
