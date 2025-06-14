import { configureStore } from '@reduxjs/toolkit';

import uiSlice from '../slices/urlslice';
import authSlice from '../slices/authSlice';
import departmentSlice from '../slices/departmentSlice';
import serviceSlice from '../slices/serviceSlice';
const store = configureStore({
    reducer: {
        ui: uiSlice,
        auth: authSlice,
        department: departmentSlice,
        service: serviceSlice,
    },
});

export default store;