<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Props to make the component configurable
const emit = defineEmits(['periodChange']);

// Reactive date range
const startDate = ref(null);
const endDate = ref(null);

// Watch for date range changes
const onDateRangeChange = (event) => {
    const inputs = event.target.closest('[date-rangepicker]').querySelectorAll('input');
    const start = new Date(inputs[0].value);
    const end = new Date(inputs[1].value);

    // Ensure date is set correctly without time
    startDate.value = start.toISOString().split("T")[0]; // YYYY-MM-DD format
    endDate.value = end.toISOString().split("T")[0];

    // Update chart with new date range
    emit('periodChange', { start: startDate.value, end: endDate.value });
};

onMounted(() => {
    // Add event listener to date range picker
    const dateRangePicker = document.getElementById('date-range-picker');
    if (dateRangePicker) {
        dateRangePicker.addEventListener('change', onDateRangeChange);
    }
});

// Optional: Clean up chart and event listeners on unmount
onUnmounted(() => {
    const dateRangePicker = document.getElementById('date-range-picker');
    if (dateRangePicker) {
        dateRangePicker.removeEventListener('change', onDateRangeChange);
    }
});
</script>

<template>
    <div class="" date-rangepicker>
        <div id="date-range-picker" class="flex items-center">
            <!-- Date Range Inputs -->
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

                    <div class="mx-3">
                        <p>to</p>
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
</template>

<style scoped>

</style>
