import axios from 'axios';
import store from '@/redux/app/store';
import { setAuthTokens } from '@/redux/slices/authSlice';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/tokenPersistence';

// Check if code is running in browser
const isBrowser = typeof window !== 'undefined';

// Get API URL from environment variables
// NEXT_PUBLIC_ prefix allows the variable to be accessible in the browser
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && isBrowser) {
  console.warn('NEXT_PUBLIC_API_URL is not defined in environment variables! Falling back to default URL.');
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL || 'http://localhost:8000/api', // Fallback if env var is not set
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authentication interceptor
apiClient.interceptors.request.use(config => {
  // First try to get token from Redux store
  const state = store.getState();
  let token = state.auth.tokens?.access;
  
  // If not found, fall back to cookies
  if (!token) {
    token = getAccessToken();
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add token refresh interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // First try to get refresh token from Redux store
        const state = store.getState();
        let refreshToken = state.auth.tokens?.refresh;
        
        // If not found, fall back to cookies
        if (!refreshToken) {
          refreshToken = getRefreshToken();
        }
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL || 'http://localhost:8000/api'}/token/refresh/`, {
          refresh: refreshToken
        });
        
        // Update tokens in both Redux and cookies
        const newAccessToken = response.data.access;
        setTokens(newAccessToken, refreshToken);
        
        // Update Redux store
        store.dispatch(setAuthTokens({
          access: newAccessToken,
          refresh: refreshToken
        }));
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        // Refresh token expired or invalid, clear tokens and redirect to login
        clearTokens();
        
        // Clear Redux store
        store.dispatch(setAuthTokens({ access: null, refresh: null }));
        
        // Navigate to home page only in browser environment
        if (isBrowser) {
          import('next/router').then(module => {
            const Router = module.default;
            Router.push('/');
          });
        }
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
