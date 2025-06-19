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

export const fetchDepartmentSubscriptions = createAsyncThunk(
  'service/fetchDepartmentSubscriptions',
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.listDepartmentSubscriptions(departmentId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'service/cancelSubscription',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      await serviceAPI.cancelSubscription(subscriptionId);
      return subscriptionId;
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

export const fetchSubscriptionUsers = createAsyncThunk(
  'service/fetchSubscriptionUsers',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.listSubscriptionUsers(subscriptionId);
      return { subscriptionId, users: response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeSubscriptionUser = createAsyncThunk(
  'service/removeSubscriptionUser',
  async ({ subscriptionId, userId }, { rejectWithValue }) => {
    try {
      await serviceAPI.removeSubscriptionUser(subscriptionId, userId);
      return { subscriptionId, userId };
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
  subscriptionUsers: {},  // Map of subscription ID to list of users
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

      // Fetch department subscriptions cases
      .addCase(fetchDepartmentSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchDepartmentSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch department subscriptions' };
      })

      // Cancel subscription cases
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subscriptions = state.subscriptions.filter(
          subscription => subscription.id !== action.payload
        );
        if (state.currentSubscription && state.currentSubscription.id === action.payload) {
          state.currentSubscription = null;
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to cancel subscription' };
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
        // If we have subscription users for this subscription, add the new user
        const subscriptionId = action.payload.subscription;
        if (state.subscriptionUsers[subscriptionId]) {
          state.subscriptionUsers[subscriptionId] = [
            ...state.subscriptionUsers[subscriptionId],
            action.payload
          ];
        }
      })
      .addCase(grantServiceAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to grant service access' };
      })

      // Fetch subscription users cases
      .addCase(fetchSubscriptionUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionUsers = { 
          ...state.subscriptionUsers, 
          [action.payload.subscriptionId]: action.payload.users 
        };
      })
      .addCase(fetchSubscriptionUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch subscription users' };
      })

      // Remove subscription user cases
      .addCase(removeSubscriptionUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeSubscriptionUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update subscription users list if we have it
        const { subscriptionId, userId } = action.payload;
        if (state.subscriptionUsers[subscriptionId]) {
          state.subscriptionUsers[subscriptionId] = state.subscriptionUsers[subscriptionId].filter(
            user => user.user !== userId
          );
        }
      })
      .addCase(removeSubscriptionUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to remove user access' };
      });
  },
});

// Export actions
export const { clearServiceError, setCurrentSubscription } = serviceSlice.actions;

// Export reducer
export default serviceSlice.reducer;
