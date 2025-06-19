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
 * Store tokens in cookies only
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const setTokens = (accessToken, refreshToken) => {
  if (!isBrowser) return; // Skip if not in browser
  
  // Store in cookies only (works in both client & server)
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS);
};

/**
 * Get access token from cookies
 * @returns {string|null} Access token or null if not found
 */
export const getAccessToken = () => {
  if (!isBrowser) return null;
  
  // Get from cookie
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
};

/**
 * Get refresh token from cookies
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
  if (!isBrowser) return null;
  
  // Get from cookie
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
};

/**
 * Remove all authentication tokens
 */
export const clearTokens = () => {
  if (!isBrowser) return;
  
  // Remove from cookies
  Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
};

/**
 * Check if user is authenticated based on token existence
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};
