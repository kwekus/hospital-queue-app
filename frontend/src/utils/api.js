/**
 * API Configuration
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = {
  joinQueue: `${API_BASE_URL}/join-queue`,
  getQueue: `${API_BASE_URL}/get-queue`,
  serveNext: `${API_BASE_URL}/serve-next`,
  resetQueue: `${API_BASE_URL}/reset-queue`,
};

export default api;
