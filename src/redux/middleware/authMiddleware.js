import { getAccessToken, getRefreshToken } from '@/utils/tokenPersistence';
import { setAuthTokens } from '@/redux/slices/authSlice';

// Middleware to sync tokens from cookies to Redux state on app initialization
export const initializeAuth = (store) => {
  if (typeof window !== 'undefined') {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    
    if (accessToken && refreshToken) {
      // Dispatch action to set tokens in Redux state
      store.dispatch(setAuthTokens({
        access: accessToken,
        refresh: refreshToken
      }));
    }
  }
};

export default initializeAuth;
