<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import ApexCharts from 'apexcharts';

// Props to make the component configurable
const props = defineProps({
    selectedPeriod: {
        type: String,
        default: 'Last week'
    },
    dateRange: {
        type: Object,
        default: () => ({ start: null, end: null })
    }
});

const emit = defineEmits(['periodChange']);

// Reactive date range
const startDate = ref(null);
const endDate = ref(null);

// Reference to chart container
const lineChart = ref(null);
let chart = null;

// Dummy data generation function with date range support
const generateDateRangeData = (start, end) => {
    // If no dates are selected, use default last week data
    if (!start || !end) {
        return {
            borrowed: [65, 72, 58, 80, 74, 69],
            returned: [60, 68, 58, 78, 70, 65],
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        };
    }

    // Calculate the number of days between start and end dates
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Generate data based on the date range
    const borrowed = Array.from({ length: diffDays }, () => Math.floor(Math.random() * 50));
    const returned = Array.from({ length: diffDays }, () => Math.floor(Math.random() * 50));

    // Generate categories (dates)
    const categories = Array.from({ length: diffDays }, (_, i) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        // Ensure proper formatting and no extra characters
        return `${currentDate.toLocaleString('en-US', { month: 'short' })} ${currentDate.getDate()}`;
    });

    return {
        borrowed,
        returned,
        categories
    };
};

// Reactive chart options
const options = ref({
    chart: {
        height: "100%",
        maxWidth: "90%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
            enabled: false,
        },
        toolbar: {
            show: true,
        },
    },
    tooltip: {
        enabled: true,
        x: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 6,
        curve: 'smooth'
    },
    grid: {
        show: false,
        strokeDashArray: 1,
        padding: {
            left: 2,
            right: 2,
            top: -26
        },
    },
    series: [
        {
            name: "Borrowed",
            data: [65, 72, 58, 80, 74, 69],
            color: "#bf1029",
        },
        {
            name: "Returned",
            data: [60, 68, 58, 78, 70, 65],
            color: "#3f8f29",
        },
    ],
    legend: {
        show: false
    },
    xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        labels: {
            show: true,
            style: {
                fontFamily: "Inter, sans-serif",
                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
            }
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        show: false,
    },
});

// Function to update chart
const updateChart = (start = null, end = null) => {
    if (!chart) return;

    const { borrowed, returned, categories } = generateDateRangeData(start, end);

    chart.updateOptions({
        series: [
            { name: "Borrowed", data: borrowed },
            { name: "Returned", data: returned }
        ],
        xaxis: { categories }
    });
};

// Watch for date range changes
watch(() => props.dateRange, (newRange) => {
    updateChart(newRange.start, newRange.end);
}, { deep: true });

onMounted(() => {
    if (lineChart.value) {
        chart = new ApexCharts(lineChart.value, options.value);
        chart.render();
    }

    // Add event listener to date range picker
    const dateRangePicker = document.getElementById('date-range-picker');
    if (dateRangePicker) {
        dateRangePicker.addEventListener('change', onDateRangeChange);
    }
});

// Optional: Clean up chart and event listeners on unmount
onUnmounted(() => {
    if (chart) {
        chart.destroy();
    }

    const dateRangePicker = document.getElementById('date-range-picker');
    if (dateRangePicker) {
        dateRangePicker.removeEventListener('change', onDateRangeChange);
    }
});

// Watch for date range changes
const onDateRangeChange = (event) => {
    const inputs = event.target.closest('[date-rangepicker]').querySelectorAll('input');
    const start = new Date(inputs[0].value);
    const end = new Date(inputs[1].value);

    // Ensure date is set correctly without time
    startDate.value = start.toISOString().split("T")[0]; // YYYY-MM-DD format
    endDate.value = end.toISOString().split("T")[0];

    // Update chart with new date range
    updateChart(start, end);
};
</script>

<template>
    <div class="">
        <div class="grid grid-cols-3 ">
            <div class="grid grid-cols-2 items-center text-start">
                <div>
                    <h5 class="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
                        Borrowed</h5>
                    <p class="text-gray-900 dark:text-white text-2xl leading-none font-bold">418</p>
                </div>
                <div>
                    <h5 class="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
                        Returned</h5>
                    <p class="text-gray-900 dark:text-white text-2xl leading-none font-bold">399</p>
                </div>
            </div>
        </div>

        <div class="items-center bg-white rounded-lg shadow-sm dark:bg-gray-800 p-2">
            <div ref="lineChart" id="line-chart" class="h-80 w-full"></div>
        </div>
    </div>
</template>

<style scoped>
/* Optional: Add any additional dark mode specific styles if needed */
</style>
