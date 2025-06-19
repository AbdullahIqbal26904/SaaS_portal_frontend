import apiClient from './client';
import store from '@/redux/app/store';
import { setAuthTokens } from '@/redux/slices/authSlice';
import { setTokens } from '@/utils/tokenPersistence';

// Authentication API functions
const authAPI = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/users/auth/login/', { email, password });
      
      // Store tokens in both Redux store and cookies
      if (response.data.tokens) {
        // Set in cookies
        setTokens(response.data.tokens.access, response.data.tokens.refresh);
        
        // Set in Redux store
        store.dispatch(setAuthTokens(response.data.tokens));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred during login' };
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users/auth/register/', userData);
      
      // Store tokens in both Redux store and cookies
      if (response.data.tokens) {
        // Set in cookies
        setTokens(response.data.tokens.access, response.data.tokens.refresh);
        
        // Set in Redux store
        store.dispatch(setAuthTokens(response.data.tokens));
      }
      
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
