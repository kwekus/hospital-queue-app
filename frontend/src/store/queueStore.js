/**
 * Zustand store for queue management
 * Global state management for the application
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const useQueueStore = create((set, get) => ({
  // State
  queue: [],
  userQueueNumber: null,
  userName: null,
  isLoading: false,
  error: null,
  lastRefresh: null,
  adminMode: false,

  // Actions
  setAdminMode: (isAdmin) => set({ adminMode: isAdmin }),

  // Fetch queue from API
  fetchQueue: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/get-queue`);
      set({
        queue: response.data.queue || [],
        lastRefresh: new Date().toISOString(),
        isLoading: false,
      });
      return response.data.queue;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch queue';
      set({ error: errorMsg, isLoading: false });
      console.error('Fetch queue error:', err);
      return null;
    }
  },

  // Join queue
  joinQueue: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/join-queue`, { name });
      const patient = response.data.patient;

      set({
        userQueueNumber: patient.queueNumber,
        userName: patient.name,
        isLoading: false,
      });

      // Save to local storage
      await AsyncStorage.setItem(
        'userQueueData',
        JSON.stringify({
          queueNumber: patient.queueNumber,
          name: patient.name,
          timestamp: patient.timestamp,
        })
      );

      // Fetch updated queue
      await get().fetchQueue();

      return patient;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to join queue';
      set({ error: errorMsg, isLoading: false });
      console.error('Join queue error:', err);
      return null;
    }
  },

  // Serve next patient (admin only)
  serveNext: async (adminKey) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/serve-next`, {
        adminKey,
      });

      set({
        queue: response.data.queue || [],
        lastRefresh: new Date().toISOString(),
        isLoading: false,
      });

      return response.data.servedPatient;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to serve next patient';
      set({ error: errorMsg, isLoading: false });
      console.error('Serve next error:', err);
      return null;
    }
  },

  // Reset queue (admin only)
  resetQueue: async (adminKey) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_BASE_URL}/reset-queue`, { adminKey });

      set({
        queue: [],
        lastRefresh: new Date().toISOString(),
        isLoading: false,
      });

      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to reset queue';
      set({ error: errorMsg, isLoading: false });
      console.error('Reset queue error:', err);
      return false;
    }
  },

  // Load user data from local storage
  loadUserData: async () => {
    try {
      const data = await AsyncStorage.getItem('userQueueData');
      if (data) {
        const parsedData = JSON.parse(data);
        set({
          userQueueNumber: parsedData.queueNumber,
          userName: parsedData.name,
        });
      }
    } catch (err) {
      console.error('Load user data error:', err);
    }
  },

  // Clear user data
  clearUserData: async () => {
    try {
      await AsyncStorage.removeItem('userQueueData');
      set({
        userQueueNumber: null,
        userName: null,
      });
    } catch (err) {
      console.error('Clear user data error:', err);
    }
  },

  // Get user position in queue
  getUserPosition: () => {
    const { queue, userQueueNumber } = get();
    if (!userQueueNumber) return null;
    const position = queue.findIndex((p) => p.queueNumber === userQueueNumber);
    return position >= 0 ? position + 1 : null;
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useQueueStore;
