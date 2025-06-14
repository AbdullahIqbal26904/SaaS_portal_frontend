import apiClient from './client';

// Authentication API functions
export const authAPI = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/users/auth/login/', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred during login' };
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users/auth/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred during registration' };
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/token/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error refreshing token' };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching profile' };
    }
  },
};

export default authAPI;
