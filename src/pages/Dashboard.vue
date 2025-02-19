<script setup>
import { ref, onMounted } from "vue";
import { initFlowbite } from 'flowbite'
import LineGraph from '../components/Dashboard/LineGraph.vue';
import BarGraph from "../components/Dashboard/BarGraph.vue";
import TransactionHistoryTable from "../components/Dashboard/TransactionHistoryTable.vue";

// Reactive reference for the chart
const selectedPeriod = ref('Last week');

const emit = defineEmits(['update:startDate', 'update:endDate']);

// Reactive date range
const startDate = ref(null);
const endDate = ref(null);

const onDateRangeChange = () => {
    console.log("Dashboard date range changed:", startDate.value, endDate.value);
    emit('update:startDate', startDate.value);
    emit('update:endDate', endDate.value);
};

// Initialize Flowbite's Datepicker
onMounted(() => {
    initFlowbite(); // Ensures Flowbite components are initialized

    // Get the datepicker elements
    const startDateInput = document.getElementById("datepicker-range-start");
    const endDateInput = document.getElementById("datepicker-range-end");

    if (startDateInput && endDateInput) {
        // Use MutationObserver to watch for changes in the input values
        const startDateObserver = new MutationObserver((mutations) => {
            const currentValue = startDateInput.value;
            if (currentValue) {
                startDate.value = currentValue;
                onDateRangeChange();
            }
        });

        const endDateObserver = new MutationObserver((mutations) => {
            const currentValue = endDateInput.value;
            if (currentValue) {
                endDate.value = currentValue;
                onDateRangeChange();
            }
        });

        // Configure the observers to watch for attribute changes
        startDateObserver.observe(startDateInput, { 
            attributes: true, 
            attributeFilter: ['value'] 
        });

        endDateObserver.observe(endDateInput, { 
            attributes: true, 
            attributeFilter: ['value'] 
        });
    } else {
        console.error("Flowbite Datepicker elements not found!");
    }
});



</script>

<template>
    <div>
        <header class="shadow">
            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 class="text-3xl font-bold tracking-tight dark:text-gray-200 ">
                    Dashboard
                </h1>
            </div>
        </header>

        <!-- Date Range Inputs -->
        <div class="flex col-span-2 items-center gap-4">
            <div id="date-range-picker" class="flex items-center">
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </div>
                    <input type="date" id="datepicker-range-start" v-model="startDate" @change="onDateRangeChange"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Start date (yyyy-MM-dd)">
                </div>

                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </div>
                    <input type="date" id="datepicker-range-end" v-model="endDate" @change="onDateRangeChange"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="End date (yyyy-MM-dd)">
                </div>
            </div>
        </div>

        <div class="flex gap-3 p-4 h-120">
            <!-- BAR GRAPH -->
            <div class=" w-1/2">
                <div
                    class="card w-full h-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6 flex justify-between mb-5 ">
                    <BarGraph :selectedPeriod="selectedPeriod" class="w-full " />
                </div>
            </div>

            <!-- LINE GRAPH -->
            <div class=" w-1/2">
                <div
                    class="card w-full h-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6 flex justify-between mb-5 ">
                    <LineGraph :startDate="startDate" :endDate="endDate"
                        @update:startDate="(value) => { startDate = value; onDateRangeChange(); }"
                        @update:endDate="(value) => { endDate = value; onDateRangeChange(); }" />



                </div>
            </div>
        </div>

        <!-- HISTORY TABLE -->
        <div class="mb-10">
            <TransactionHistoryTable />
        </div>
    </div>
</template>

<style scoped>
/* Optional: Add any additional dark mode specific styles if needed */
</style>