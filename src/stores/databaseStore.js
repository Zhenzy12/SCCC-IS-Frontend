// /src/stores/databaseStore.js
import { defineStore } from 'pinia'
import axiosClient from '../axios'

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    officeEquipments: [],
    officeSupplies: [],
    equipmentCopies: [],
    categoryList: [],
    transactionItems: [],
    transactionHistory: [],
    users: [],
    borrowers: [],
    officeList: [],
    inventoryAccesses: [],
    fetchedDataCount: 0,
    isLoading: true,
  }),
  actions: {
    async fetchData() {
      this.isLoading = true
      this.fetchedDataCount = 0
      const API_KEY = import.meta.env.VITE_API_KEY
      try {
        // Execute all requests concurrently
        const [
          resEquipments,
          resSupplies,
          resEquipmentCopies,
          resCategories,
          resTransactionItems,
          resTransactionHistory,
          resUsers,
          resBorrowers,
          resOfficeList,
          resInventoryAccesses,
        ] = await Promise.all([
          axiosClient.get('/api/office_equipments', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/office_supplies', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/equipment_copies', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/categories', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/borrow_transaction_items', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/borrow_transactions', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/users', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/borrowers', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/offices', { headers: { 'x-api-key': API_KEY } }),
          axiosClient.get('/api/inventory_access', { headers: { 'x-api-key': API_KEY } }),
        ])

        // Map or assign the fetched data
        this.officeEquipments = resEquipments.data.map(equipment => ({
          ...equipment,
          serial_number: equipment.serial_number || null,
          quantity: equipment.quantity || null,
          type: equipment.type || 'Office Equipment',
        }))
        this.fetchedDataCount += 1

        this.officeSupplies = resSupplies.data.map(supply => ({
          ...supply,
          type: supply.type || 'Office Supply',
        }))

        this.equipmentCopies = resEquipmentCopies.data
        this.categoryList = resCategories.data
        this.transactionItems = resTransactionItems.data
        this.transactionHistory = resTransactionHistory.data
        this.users = resUsers.data
        this.borrowers = resBorrowers.data
        this.officeList = resOfficeList.data
        this.inventoryAccesses = resInventoryAccesses.data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Example update action – update an item then re-fetch data
    async updateItem(updatedItem) {
      try {
        const API_KEY = import.meta.env.VITE_API_KEY
        // Example: assuming the update endpoint is /api/items/:id
        await axiosClient.put(`/api/items/${updatedItem.id}`, updatedItem, {
          headers: { 'x-api-key': API_KEY },
        })
        // After updating, re-fetch all data
        await this.fetchData()
      } catch (error) {
        console.error('Error updating item:', error)
      }
    },

    // You can similarly add addItem, deleteItem actions if needed
  },
})
