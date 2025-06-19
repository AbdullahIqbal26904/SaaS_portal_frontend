import Cookies from 'js-cookie';

// Constants
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: '/',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production' // Only use secure in production
};

// Helper function to check if running in browser
const isBrowser = typeof window !== 'undefined';

/**
 * Store tokens in both Redux and cookies for redundancy
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const setTokens = (accessToken, refreshToken) => {
  // Store in cookies first (works in both client & server)
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS);
  
  // Store in localStorage as fallback (client-side only)
  if (isBrowser) {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.warn('Failed to store tokens in localStorage:', error);
    }
  }
};

/**
 * Get access token from cookies or localStorage
 * @returns {string|null} Access token or null if not found
 */
export const getAccessToken = () => {
  // Try to get from cookie first
  const cookieToken = Cookies.get(ACCESS_TOKEN_KEY);
  if (cookieToken) return cookieToken;
  
  // Fall back to localStorage if running in browser
  if (isBrowser) {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to retrieve access token from localStorage:', error);
    }
  }
  
  return null;
};

/**
 * Get refresh token from cookies or localStorage
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
  // Try to get from cookie first
  const cookieToken = Cookies.get(REFRESH_TOKEN_KEY);
  if (cookieToken) return cookieToken;
  
  // Fall back to localStorage if running in browser
  if (isBrowser) {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to retrieve refresh token from localStorage:', error);
    }
  }
  
  return null;
};

/**
 * Remove all authentication tokens
 */
export const clearTokens = () => {
  // Remove from cookies
  Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
  
  // Remove from localStorage if running in browser
  if (isBrowser) {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Failed to remove tokens from localStorage:', error);
    }
  }
};

/**
 * Check if user is authenticated based on token existence
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};
