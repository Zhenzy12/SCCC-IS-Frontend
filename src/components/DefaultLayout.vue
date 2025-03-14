<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import logoURL from '../assets/baguio-logo.png';
import axiosClient from "../axios.js";
import router from "../router.js";
import useUserStore from "../stores/user.js";
import { useThemeStore } from '../stores/themeStore';
import { DisclosureButton, Disclosure, DisclosurePanel } from '@headlessui/vue'

const signout_visible = ref(false);

const isProfileDropdownOpen = ref(false);

const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value;
  localStorage.setItem("is_expanded", is_expanded.value);
  isProfileDropdownOpen.value = false;
};

const bgClass = computed(() =>
  themeStore.isDarkMode
    ? 'bg-gray-800 text-gray-100'
    : 'bg-gray-100 text-gray-900'
)

const route = useRoute();
const userStore = useUserStore();
const themeStore = useThemeStore();
const user = computed(() => userStore.user);

const isMobileOrTablet = ref(window.innerWidth < 767);

const handleResize = () => {
  isMobileOrTablet.value = window.innerWidth < 767;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const navigation = [
  { name: 'Upload', to: { name: 'Home' }, icon: 'pi-upload' },
  { name: 'My Images', to: { name: 'MyImages' }, icon: 'pi-images' },
  { name: 'Dashboard', to: { name: 'Dashboard' }, icon: 'pi-home' },
  { name: 'Inventory', to: { name: 'Inventory' }, icon: 'pi-warehouse' },
  { name: 'Reports', to: { name: 'Reports' }, icon: 'pi-chart-bar' },
  { name: 'Borrowed', to: { name: 'Borrowed' }, icon: 'pi-box' },
]


// Toggle dropdown visibility
const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
  is_expanded.value = "true";
  localStorage.setItem("is_expanded", is_expanded.value);
};

// Dummy edit profile function (replace with actual navigation)
const editProfile = () => {
  router.push({ name: 'EditProfile' }); // Make sure this route exists
};

function logout() {
  axiosClient.post('/logout').then(() => {
    router.push({ name: 'Login' });
  });
}

// Theme Computed Properties
const themeIcon = computed(() => themeStore.isDarkMode ? 'pi-moon' : 'pi-sun');
const themeLabel = computed(() => themeStore.isDarkMode ? 'Dark Mode' : 'Light Mode');

</script>

<template>
  <div class="flex flex-row min-h-screen relative">
    <!-- Sidebar -->
    <aside class="h-screen sticky top-0" :class="[
      is_expanded ? 'w-full md:w-64' : 'w-16',
      'flex flex-col bg-gray-900 text-white p-4 transition-all duration-200 ease-in-out overflow-hidden',
      is_expanded && isMobileOrTablet ? 'fixed inset-0 z-50' : 'relative',
      themeStore.isDarkMode ? 'dark:bg-black' : 'bg-gray-900',
    ]">
      <!-- Logo Section -->
      <div class="mb-4 flex items-center">
        <div class="w-8 flex-shrink-0">
          <img :src="logoURL" alt="Logo" class="w-8 h-8" />
        </div>
        <span class="ml-4 transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden"
          :class="{ 'opacity-100 max-w-full': is_expanded, 'opacity-0 max-w-0': !is_expanded }">Inventory
          System</span>
      </div>

      <!-- Toggle Button -->
      <div class="flex justify-end mb-4">
        <button @click="ToggleMenu" class="w-8 flex-shrink-0 transition-transform duration-200 ease-in-out transform"
          :class="{ 'rotate-180': is_expanded }">
          <span class="material-icons text-2xl text-white hover:text-indigo-500">keyboard_double_arrow_right</span>
        </button>
      </div>

      <!-- Menu -->
      <h3
        class="text-gray-400 text-sm uppercase mb-2 transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden"
        :class="{ 'opacity-100 max-w-full': is_expanded, 'opacity-0 max-w-0': !is_expanded }">
        Menu
      </h3>

      <div class="-mx-4">
        <RouterLink v-for='item in navigation' :to="item.to" :key="item.name"
          :class="[$route.name === item.to.name ? 'bg-gray-800 border-r-4 border-indigo-500' : ' hover:bg-gray-800', 'flex items-center p-2 pl-4 transition duration-200 ease-in-out']">
          <div class="w-8 flex-shrink-0">
            <i class="pi" :class="item.icon" style="font-size: 1.5rem"></i>
          </div>
          <span class="ml-4 transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden"
            :class="{ 'opacity-100 max-w-full': is_expanded, 'opacity-0 max-w-0': !is_expanded }">{{ item.name }}</span>
        </RouterLink>
      </div>

      <div class="flex-1"></div>

      <h3
        class="text-gray-400 text-sm uppercase mb-2 transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden"
        :class="{ 'opacity-100 max-w-full': is_expanded, 'opacity-0 max-w-0': !is_expanded }">
        Settings
      </h3>

      <!-- Theme Toggle Button -->
      <button @click="themeStore.toggleTheme" class="min-w-full text-left -mx-4">
        <div class="flex items-center p-2 pl-5 transition duration-200 ease-in-out hover:bg-gray-800">
          <div class="w-8 flex-shrink-0">
            <i class="pi" :class="themeIcon" style="font-size: 1.5rem"></i>
          </div>
          <span class="ml-4 transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden"
            :class="{ 'opacity-100 max-w-full': is_expanded, 'opacity-0 max-w-0': !is_expanded }">
            {{ themeLabel }}
          </span>
        </div>
      </button>


      <div class="relative -mx-4">
        <!-- Profile Section -->
        <button @click="toggleProfileDropdown" class="w-full text-left">
          <div class="flex items-center p-2 pl-4 transition duration-200 ease-in-out hover:bg-gray-800">
            <div class="w-8 flex-shrink-0">
              <img class="size-8 rounded-full" src="https://randomuser.me/api/portraits/men/81.jpg" alt="Profile" />
            </div>
            <span class="ml-4 transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden"
              :class="{ 'opacity-100 max-w-full': is_expanded, 'opacity-0 max-w-0': !is_expanded }">

              <div class="ml-3 text-left transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden"
                :class="{ 'opacity-100 max-w-full': is_expanded, 'opacity-0 max-w-0': !is_expanded }">
                <div class="text-base font-medium text-white">{{ user?.name || 'Guest' }}</div>
                <div class="text-sm font-medium text-gray-400">{{ user?.email || 'No email' }}</div>
              </div>
            </span>

            <span class="material-icons ml-auto text-gray-400 transition-transform"
              :class="{ 'rotate-180': isProfileDropdownOpen }">
              expand_more
            </span>
          </div>
        </button>

        <!-- Dropdown Menu -->
        <div v-if="isProfileDropdownOpen"
          class="absolute right-4 bottom-full mb-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-100 w-[90%]">
          <button @click="editProfile"
            class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
            Edit Profile
          </button>
          <button @click="signout_visible = true"
            class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
            Sign Out
          </button>
        </div>
      </div>
    </aside>

    <!-- Backdrop for Mobile/Tablet -->
    <div v-if="is_expanded && isMobileOrTablet" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="ToggleMenu">
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 transition-all duration-300 ease-in-out overflow-auto">
      <router-view class="h-screen" :class="bgClass" />

      <Dialog :visible="signout_visible" modal header="Sign out" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Are you sure you want to sign out?</span>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="signout_visible = false"></Button>
          <Button type="button" label="Sign out" @click="logout"></Button>
        </div>
      </Dialog>
    </main>
  </div>
</template>


<style scoped>
@media (max-width: 1024px) {
  aside {
    height: 100vh;
  }
}
</style>
