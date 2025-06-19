import axios from 'axios';

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
  if (isBrowser) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add token refresh interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    // Only try to refresh token in browser environment
    if (!isBrowser) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL || 'http://localhost:8000/api'}/token/refresh/`, {
          refresh: refreshToken
        });
        
        localStorage.setItem('accessToken', response.data.access);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return apiClient(originalRequest);
      } catch (err) {
        // Refresh token expired or invalid, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Use router for navigation if possible to prevent hard refresh
        // Otherwise fallback to window.location
        window.location.href = '/';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
