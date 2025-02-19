<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import ApexCharts from 'apexcharts';

// Props to make the component configurable
const props = defineProps({
  selectedPeriod: {
    type: String,
    default: 'Last week'
  },
  startDate: String,
  endDate: String
});

const emit = defineEmits(['periodChange']);

const startDate = computed({
    get: () => props.startDate,
    set: (value) => {
        console.log("Emitting startDate update:", value);
        emit('update:startDate', value);
    }
});

const endDate = computed({
    get: () => props.endDate,
    set: (value) => {
        console.log("Emitting endDate update:", value);
        emit('update:endDate', value);
    }
});

// Function to generate data based on date range
const generateDateRangeData = (start, end) => {
    console.log("Generating data for range:", start, "to", end);

    if (!start || !end) {
        console.warn("No date range provided, using default data.");
        return {
            borrowed: [65, 72, 58, 80, 74, 69],
            returned: [60, 68, 58, 78, 70, 65],
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        };
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
        console.error("Invalid date values:", start, end);
        return;
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const borrowed = Array.from({ length: diffDays }, () => Math.floor(Math.random() * 50));
    const returned = Array.from({ length: diffDays }, () => Math.floor(Math.random() * 50));

    const categories = Array.from({ length: diffDays }, (_, i) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        return `${currentDate.toLocaleString('en-US', { month: 'short' })} ${currentDate.getDate()}`;
    });

    console.log("Generated Data:", { borrowed, returned, categories });

    return { borrowed, returned, categories };
};

// Chart configuration
const options = ref({
    chart: {
        height: "100%",
        maxWidth: "90%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: { enabled: false },
        toolbar: { show: true },
    },
    tooltip: { enabled: true, x: { show: false } },
    dataLabels: { enabled: false },
    stroke: { width: 6, curve: 'smooth' },
    grid: {
        show: false,
        strokeDashArray: 1,
        padding: { left: 2, right: 2, top: -26 },
    },
    series: [
        { name: "Borrowed", data: [65, 72, 58, 80, 74, 69], color: "#bf1029" },
        { name: "Returned", data: [60, 68, 58, 78, 70, 65], color: "#3f8f29" },
    ],
    legend: { show: false },
    xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        labels: {
            show: true,
            style: {
                fontFamily: "Inter, sans-serif",
                cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-200'
            }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: { show: false }
});

const lineChart = ref(null);
let chart = null;

// Function to update chart with new data
const updateChart = (start = null, end = null) => {
    console.log("Updating chart with dates:", start, end);
    if (!chart) {
        console.warn("Chart instance is not initialized yet.");
        return;
    }

    const data = generateDateRangeData(start, end);
    if (!data) return;

    console.log("Updating chart with new data:", data);

    chart.updateOptions({
        series: [
            { name: "Borrowed", data: data.borrowed },
            { name: "Returned", data: data.returned }
        ],
        xaxis: { categories: data.categories }
    });
};

// Function to handle date range change
const onDateRangeChange = () => {
    console.log("Dashboard date range changed:", startDate.value, endDate.value);
    emit('update:startDate', startDate.value);
    emit('update:endDate', endDate.value);
};


// Watch for period selection changes
watch(() => props.selectedPeriod, (newPeriod) => {
    console.log("Selected period changed:", newPeriod);
    if (newPeriod === 'Last week') {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        updateChart(lastWeek.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    }
}, { immediate: true });

// Watch for date range changes
watch(() => [props.startDate, props.endDate], ([newStart, newEnd]) => {
    console.log("Watched props changed: startDate =", newStart, ", endDate =", newEnd);
    
    if (chart && newStart && newEnd) { // Ensure the chart exists
        updateChart(newStart, newEnd);
    }
});



onMounted(() => {
    console.log("Component Mounted. Initializing chart...");
    if (lineChart.value) {
        chart = new ApexCharts(lineChart.value, options.value);
        chart.render().then(() => {
            console.log("Chart initialized successfully.");
            updateChart(startDate.value, endDate.value); // ✅ Update after rendering
        });
    }
});


onUnmounted(() => {
    console.log("Component Unmounted. Destroying chart...");
    if (chart) {
        chart.destroy();
    }
});
</script>

<template>
    <div>
        <div class="grid grid-cols-3">
            <div class="grid grid-cols-2 items-center text-start">
                <div>
                    <h5 class="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
                        Borrowed
                    </h5>
                    <p class="text-gray-900 dark:text-white text-2xl leading-none font-bold">418</p>
                </div>
                <div>
                    <h5 class="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
                        Returned
                    </h5>
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
