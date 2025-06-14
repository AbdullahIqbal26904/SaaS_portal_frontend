import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceAPI from '@/api/service';

// Async thunks for services and subscriptions
export const fetchServicePackages = createAsyncThunk(
  'service/fetchServicePackages',
  async (activeOnly = true, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.listServicePackages(activeOnly);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createSubscription = createAsyncThunk(
  'service/createSubscription',
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.createSubscription(subscriptionData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const grantServiceAccess = createAsyncThunk(
  'service/grantServiceAccess',
  async ({ subscriptionId, userId }, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.grantServiceAccess(subscriptionId, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Initial state
const initialState = {
  servicePackages: [],
  subscriptions: [],
  currentSubscription: null,
  loading: false,
  error: null,
  success: false,
};

// Service slice
const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    clearServiceError: (state) => {
      state.error = null;
      state.success = false;
    },
    setCurrentSubscription: (state, action) => {
      state.currentSubscription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch service packages cases
      .addCase(fetchServicePackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicePackages.fulfilled, (state, action) => {
        state.loading = false;
        state.servicePackages = action.payload;
      })
      .addCase(fetchServicePackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch service packages' };
      })
      
      // Create subscription cases
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = [...state.subscriptions, action.payload];
        state.currentSubscription = action.payload;
        state.success = true;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to create subscription' };
      })
      
      // Grant service access cases
      .addCase(grantServiceAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(grantServiceAccess.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // If this access grant is related to the current subscription, update it
        if (state.currentSubscription && state.currentSubscription.id === action.payload.subscription) {
          // We would typically update the subscription users here 
          // but the API response structure doesn't include that information
        }
      })
      .addCase(grantServiceAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to grant service access' };
      });
  },
});

// Export actions
export const { clearServiceError, setCurrentSubscription } = serviceSlice.actions;

// Export reducer
export default serviceSlice.reducer;
