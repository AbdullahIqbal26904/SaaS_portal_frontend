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

export default store;