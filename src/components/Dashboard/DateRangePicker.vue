<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Props to make the component configurable
const emit = defineEmits(['periodChange']);

// Reactive date range
const startDate = ref(null);
const endDate = ref(null);

// Helper function to parse and adjust date
const parseAndAdjustDate = (dateString) => {
    if (!dateString) return null;

    // First, try to parse the date string directly
    const dateParts = dateString.split('/').map(Number);
    
    // Ensure we have year, month, day
    if (dateParts.length === 3) {
        // JavaScript months are 0-indexed, so subtract 1 from month
        // But we want to preserve the exact day entered
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        
        // Validate date against min and max dates
        const minDate = new Date('2024/12/01');
        const maxDate = new Date('2025/02/19');
        
        if (date < minDate || date > maxDate) {
            return null; // Return null if date is outside allowed range
        }
        
        return date;
    }

    // Fallback to standard date parsing
    const date = new Date(dateString);
    
    return date;
};

// Watch for date range changes
const onDateRangeChange = (event) => {
    const inputs = event.target.closest('[date-rangepicker]').querySelectorAll('input');
    
    // Parse start and end dates
    const start = parseAndAdjustDate(inputs[0].value);
    const end = parseAndAdjustDate(inputs[1].value);

    // If either start or end is not selected, do nothing
    if (!start || !end) {
        // Reset dates to null if not both are selected
        if (!start) startDate.value = null;
        if (!end) endDate.value = null;
        return;
    }

    // Ensure dates are in the correct order
    const startDateValue = start <= end ? start : end;
    const endDateValue = start <= end ? end : start;

    // Adjust end date to include the full last day
    endDateValue.setHours(23, 59, 59, 999);

    // Format dates to YYYY-MM-DD for consistency
    const formattedStart = startDateValue.toISOString().split('T')[0];
    const formattedEnd = endDateValue.toISOString().split('T')[0];

    // Update reactive variables
    startDate.value = formattedStart;
    endDate.value = formattedEnd;

    // Emit the period change with the correct date range
    emit('periodChange', { 
        start: formattedStart, 
        end: formattedEnd 
    });
};

onMounted(() => {
    // Add event listener to date range picker
    const dateRangePicker = document.getElementById('date-range-picker');
    if (dateRangePicker) {
        dateRangePicker.addEventListener('change', onDateRangeChange);
    }

    // Set default date range to today and 6 days before today
    const today = new Date('2025/02/19');
    const sixDaysBefore = new Date(today);
    sixDaysBefore.setDate(today.getDate() - 6);

    // Format dates to YYYY-MM-DD
    const formattedStart = sixDaysBefore.toISOString().split('T')[0];
    const formattedEnd = today.toISOString().split('T')[0];

    // Update reactive variables
    startDate.value = formattedStart;
    endDate.value = formattedEnd;

    // Emit the period change with the default date range
    emit('periodChange', { 
        start: formattedStart, 
        end: formattedEnd 
    });
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
                            placeholder="Start date (yyyy/MM/dd)" 
                            data-date-format="yyyy/MM/dd"
                            min="2024/12/01"
                            max="2025/02/19">
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
                            placeholder="End date (yyyy/MM/dd)" 
                            data-date-format="yyyy/MM/dd"
                            min="2024/12/01"
                            max="2025/02/19">
                    </div>
                </div>
            </div>
</template>

<style scoped>

</style>
