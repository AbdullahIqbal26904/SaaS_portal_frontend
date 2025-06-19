import { configureStore } from '@reduxjs/toolkit';

import uiSlice from '../slices/urlslice';
import authSlice from '../slices/authSlice';
import departmentSlice from '../slices/departmentSlice';
import serviceSlice from '../slices/serviceSlice';
import resellerSlice from '../slices/resellerSlice';

const store = configureStore({
    reducer: {
        ui: uiSlice,
        auth: authSlice,
        department: departmentSlice,
        service: serviceSlice,
        reseller: resellerSlice,
    },
});

// Initialize auth state from cookies in client side
if (typeof window !== 'undefined') {
    // Import dynamically to avoid SSR issues
    import('../middleware/authMiddleware').then(module => {
        const { initializeAuth } = module;
        initializeAuth(store);
    });
}

export default store;