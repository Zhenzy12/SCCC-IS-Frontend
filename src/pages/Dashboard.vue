<script setup>
import { ref, onMounted } from "vue";
import { initFlowbite } from 'flowbite'
import LineGraph from '../components/Dashboard/LineGraph.vue';
import BarGraph from "../components/Dashboard/BarGraph.vue";
import TransactionHistoryTable from "../components/Dashboard/TransactionHistoryTable.vue";

// Reactive reference for the chart
const selectedPeriod = ref('Last week');

onMounted(() => {
    initFlowbite();
});


// Reactive date range
const startDate = ref(null);
const endDate = ref(null);


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
                <div id="date-range-picker" date-rangepicker class="flex items-center">
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </div>
                        <input type="text" id="datepicker-range-start" v-model="startDate" @blur="onDateRangeChange"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Start date (yyyy-MM-dd)" data-date-format="yyyy-MM-dd">
                    </div>

                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </div>
                        <input type="text" id="datepicker-range-end" v-model="endDate" @blur="onDateRangeChange"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="End date (yyyy-MM-dd)" data-date-format="yyyy-MM-dd">
                    </div>
                </div>
            </div>

        <div class="flex gap-3 p-4 h-120">
            <!-- BAR GRAPH -->
            <div class=" w-1/2">
                <div class="card w-full h-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6 flex justify-between mb-5 ">
                    <BarGraph 
                        :selectedPeriod="selectedPeriod"
                        class="w-full "
                    />
                </div>
            </div>

            <!-- LINE GRAPH -->
            <div class=" w-1/2">
                <div class="card w-full h-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6 flex justify-between mb-5 ">
                    <LineGraph 
                        :selectedPeriod="selectedPeriod"
                        class="w-full "
                    />
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