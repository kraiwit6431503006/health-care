<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getReports } from "../services/health.service";
import type { Report } from "../types/report";
import AgeHistogram from "../components/AgeHistogram.vue";
import DiseasePieChart from "../components/DiseasePieChart.vue"
import LineChart from "../components/LineChart.vue";
import GenderPieChart from "../components/GenderHistogram.vue";
import FilterDialog from "../components/FilterDialog.vue";

const reports = ref<Report[]>([]);

async function fetchReports() {
    reports.value = await getReports();
}

onMounted(fetchReports);

const totalReports = computed(() => filteredPeople.value.length);

const todayReports = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return filteredPeople.value.filter((r) => {
        if (!r.createAt) return false;
        const date = new Date(r.createAt).toISOString().split("T")[0];
        return date === today;
    }).length;
});

const healthyCount = computed(() =>
    filteredPeople.value.filter(r => !r.conditions || r.conditions.trim() === '' || r.conditions === 'ไม่มี').length
);

const diseaseCount = computed(() =>
    filteredPeople.value.filter(r => r.conditions && r.conditions.trim() !== '').length
);

const filterDialogVisible = ref(false);
function openFilterDialog() {
    filterDialogVisible.value = true;
}

const appliedFilters = ref<{
    province?: string;
    amphure?: string;
    tambon?: string;
    startDate?: string | null
    endDate?: string | null
}>({});

function applyFilters(filters: any) {
    appliedFilters.value = filters;
}

const filteredPeople = computed(() => {
    return reports.value.filter((report) => {

        const provinceMatch = appliedFilters.value.province
            ? report.province === appliedFilters.value.province
            : true;

        const amphureMatch = appliedFilters.value.amphure
            ? report.amphure === appliedFilters.value.amphure
            : true;

        const tambonMatch = appliedFilters.value.tambon
            ? report.tambon === appliedFilters.value.tambon
            : true;

        const createDate = report.createAt ? new Date(report.createAt) : null;
        const start = appliedFilters.value.startDate ? new Date(appliedFilters.value.startDate) : null;
        const end = appliedFilters.value.endDate ? new Date(appliedFilters.value.endDate) : null;

        const dateMatch =
            (!start || (createDate && createDate >= start)) &&
            (!end || (createDate && createDate <= end));


        return (
            provinceMatch &&
            amphureMatch &&
            tambonMatch &&
            dateMatch
        );
    });
});

const dropdownOpen = ref(false);
function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value;
}

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
}

</script>

<template>
    <div class="mt-2 p-6 bg-white border rounded-lg shadow-sm">
        <div class="flex justify-between mb-4">
            <h2 class="text-2xl font-bold text-primary">Dashboard</h2>

            <div class="flex relative">
                <button @click="openFilterDialog" type="button"
                    class="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-primary hover:text-white focus:outline-none">
                    <i class="mdi mdi-filter-variant text-base"></i>

                </button>
                <button @click="toggleDropdown" type="button"
                    class="inline-flex justify-center w-full space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-text hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
                    <span>Options</span>
                    <i class="mdi mdi-menu-down text-base"></i>
                </button>
                <div v-if="dropdownOpen"
                    class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white text-gray-800 shadow-lg ring-1 ring-black/5"
                    style="top: 100%; z-index: 9999">
                    <button @click="downloadCSV"
                        class="flex w-full items-center px-4 py-2 text-sm hover:bg-primary hover:text-white space-x-2">
                        <i class="mdi mdi-download"></i>
                        <span>Downloads CSV</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4 mb-4">
            <div class="border rounded-lg p-4 col-span-6 md:col-span-3">
                <span>Total Report</span>
                <div class="flex justify-between">
                    <h2 class="text-xl text-text">{{ totalReports }}</h2>
                    <i class="mdi mdi-file-document-multiple text-xl text-primary"></i>
                </div>
            </div>

            <div class="border rounded-lg p-4 col-span-6 md:col-span-3">
                <span>Report Today</span>
                <div class="flex justify-between">
                    <h2 class="text-xl text-text">{{ todayReports }}</h2>
                    <i class="mdi mdi-file-document text-xl text-primary"></i>
                </div>
            </div>

            <div class="border rounded-lg p-4 col-span-12 md:col-span-3">
                <span>Healthy</span>
                <div class="flex justify-between">
                    <h2 class="text-xl text-text">{{ healthyCount }}</h2>
                    <i class="mdi mdi-emoticon text-xl text-success"></i>
                </div>
            </div>
            <div class="border rounded-lg p-4 col-span-12 md:col-span-3">
                <span>Congenital Disease</span>
                <div class="flex justify-between">
                    <h2 class="text-xl text-text">{{ diseaseCount }}</h2>
                    <i class="mdi mdi-emoticon-sad text-xl text-error"></i>
                </div>
            </div>

            <div class="border rounded-lg p-4 col-span-12 md:col-span-12 lg:col-span-7">
                <span>Total Report</span>
                <line-chart class="mt-2" :reports="reports"></line-chart>
            </div>



            <div class="border rounded-lg p-4 col-span-12 md:col-span-6 lg:col-span-5">
                <span>Reports by Age Group</span>
                <age-histogram class="mt-2" :reports="filteredPeople" />
            </div>

            <div class="border rounded-lg p-4 col-span-12 md:col-span-6 lg:col-span-4">
                <span>Reports by Gender</span>
                <gender-pie-chart class="mt-2" :reports="filteredPeople" />
            </div>

            <div class="border rounded-lg p-4 col-span-12 md:col-span-12 lg:col-span-8">
                <span>Reports by Disease</span>
                <disease-pie-chart class="mt-2" :reports="filteredPeople" />
            </div>
        </div>

        <filter-dialog :visible="filterDialogVisible" :required="['provinces','date']" @close="filterDialogVisible = false"
            @apply="applyFilters" />
    </div>
</template>
