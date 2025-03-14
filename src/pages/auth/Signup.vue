<script setup>

import GuestLayout from "../../components/GuestLayout.vue";
import { ref } from "vue";
import axiosClient from "../../axios.js";
import router from "../../router.js";
import logo from "../../assets/baguio-logo.png";

const data = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  password: '',
  password_confirmation: '',
  for_911: false,
})

const errors = ref({
  firstName: [],
  middleName: [],
  lastName: [],
  email: [],
  password: [],
})

function submit() {
  axiosClient.get('/sanctum/csrf-cookie').then(response => {
    axiosClient.post("/register", data.value)
      .then(response => {
        router.push({ name: 'Login' })
      })
      .catch(error => {
        console.log(error.response.data)
        errors.value = error.response.data.errors;
      })
  });
}

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-blue-900 relative">

    <!-- Main Container -->
    <div class="flex flex-col md:flex-row items-center gap-1 z-10">
      <!-- City Logo and Title -->
      <div class="text-center flex w-md items-center mb-2 md:flex-col">
        <img :src="logo" alt="City of Baguio Logo" class="w-40 mx-auto md:w-65" />
        <div class="w-3xs mx-auto md:w-xs">
          <p class="text-white text-2xl font-bold leading-tight md:text-3xl">
            Smart City Command and Control Center Inventory System
          </p>
        </div>
      </div>

      <!-- Login Form -->
      <div class="bg-white p-6 rounded-xl shadow-lg max-w-lg">
        <h2 class="text-gray-800 text-2xl text-center font-bold mb-4">Account Registration</h2>

        <form @submit.prevent="submit" class="flex grid grid-cols-3 gap-4">
          <div>
            <label for="firstName" class="block text-md font-medium text-gray-700">First Name</label>
            <input type="text" name="firstName" id="firstName" v-model="data.firstName"
              class="mt-1 w-full px-3 py-2 border text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p class="text-sm mt-1 text-red-600">
              {{ errors.firstName ? errors.firstName[0] : '' }}
            </p>
          </div>
          <div>
            <label for="middleName" class="block text-md font-medium text-gray-700">Middle Name</label>
            <input type="text" v-model="data.middleName" id="middleName" 
              class="mt-1 w-full px-3 py-2 border text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p class="text-sm mt-1 text-red-600">
              {{ errors.middleName ? errors.middleName[0] : '' }}
            </p>
          </div>
          <div>
            <label for="lastName" class="block text-md font-medium text-gray-700">Last Name</label>
            <input type="text" v-model="data.lastName" id="lastName"
              class="mt-1 w-full px-3 py-2 border text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p class="text-sm mt-1 text-red-600">
              {{ errors.lastName ? errors.lastName[0] : '' }}
            </p>
          </div>
          <div class="col-span-3">
            <label for="email" class="block text-md font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" autocomplete="email" v-model="data.email"
              class="mt-1 w-full px-3 py-2 border text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p class="text-sm mt-1 text-red-600">
              {{ errors.email ? errors.email[0] : '' }}
            </p>
          </div>

          <div class="col-span-3">
            <label for="password" class="block text-md font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password" v-model="data.password"
              class="mt-1 w-full px-3 py-2 border text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p class="text-sm mt-1 text-red-600">
              {{ errors.password ? errors.password[0] : '' }}
            </p>
          </div>

          <div class="col-span-3">
            <label for="confirmPassword" class="block text-md font-medium text-gray-700">Confirm Password</label>
            <input type="password" name="password" id="passwordConfirmation" v-model="data.password_confirmation"
              class="mt-1 w-full px-3 py-2 border text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p class="text-sm mt-1 text-red-600">
              {{ errors.password_confirmation ? errors.password_confirmation[0] : '' }}
            </p>
          </div>

          <button type="submit" class="col-span-3 w-full bg-blue-600 text-white py-2 mt-1 font-semibold rounded-md hover:bg-blue-700">Sign
            Up</button>
        </form>

        <div class="text-sm text-center mt-4">
          <router-link :to="{ name: 'Login' }" class="text-md text-blue-600 hover:underline">Already have an account? Sign
            in</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>