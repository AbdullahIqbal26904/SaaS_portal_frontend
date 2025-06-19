import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resellerAPI from '@/api/reseller';

// Async thunks for reseller management
export const fetchResellers = createAsyncThunk(
  'reseller/fetchResellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resellerAPI.getResellers();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching resellers');
    }
  }
);

export const fetchResellerDetails = createAsyncThunk(
  'reseller/fetchResellerDetails',
  async (resellerId, { rejectWithValue }) => {
    try {
      const response = await resellerAPI.getResellerDetails(resellerId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching reseller details');
    }
  }
);

export const createReseller = createAsyncThunk(
  'reseller/createReseller',
  async (resellerData, { rejectWithValue }) => {
    try {
      const response = await resellerAPI.createReseller(resellerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating reseller');
    }
  }
);

export const addResellerAdmin = createAsyncThunk(
  'reseller/addResellerAdmin',
  async ({ resellerId, adminData }, { rejectWithValue }) => {
    try {
      const response = await resellerAPI.addResellerAdmin(resellerId, adminData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding reseller admin');
    }
  }
);

export const removeResellerAdmin = createAsyncThunk(
  'reseller/removeResellerAdmin',
  async ({ resellerId, email }, { rejectWithValue }) => {
    try {
      const response = await resellerAPI.removeResellerAdmin(resellerId, email);
      return { resellerId, email };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error removing reseller admin');
    }
  }
);

export const fetchResellerCustomers = createAsyncThunk(
  'reseller/fetchResellerCustomers',
  async (resellerId, { rejectWithValue }) => {
    try {
      console.log(`Thunk: Fetching customers for reseller ID: ${resellerId}`);
      if (!resellerId) {
        return rejectWithValue('No reseller ID provided');
      }
      
      const response = await resellerAPI.getResellerCustomers(resellerId);
      console.log(`Thunk: Got response for reseller ID ${resellerId}:`, response);
      
      return { 
        resellerId, 
        customers: response 
      };
    } catch (error) {
      console.error(`Thunk: Error fetching customers for reseller ID ${resellerId}:`, error);
      return rejectWithValue(error.response?.data?.detail || error.response?.data || error.message || 'Error fetching reseller customers');
    }
  }
);

export const createResellerCustomer = createAsyncThunk(
  'reseller/createResellerCustomer',
  async ({ resellerId, customerData }, { rejectWithValue }) => {
    try {
      const response = await resellerAPI.createResellerCustomer(resellerId, customerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating reseller customer');
    }
  }
);

export const createResellerSubscription = createAsyncThunk(
  'reseller/createResellerSubscription',
  async ({ resellerId, subscriptionData }, { rejectWithValue }) => {
    try {
      const response = await resellerAPI.createResellerSubscription(resellerId, subscriptionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating reseller subscription');
    }
  }
);

// Initial state
const initialState = {
  resellers: [],
  currentReseller: null,
  resellerCustomers: {},
  loading: false,
  error: null,
  success: false
};

const resellerSlice = createSlice({
  name: 'reseller',
  initialState,
  reducers: {
    clearResellerErrors(state) {
      state.error = null;
      state.success = false;
    },
    setCurrentReseller(state, action) {
      state.currentReseller = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch resellers
      .addCase(fetchResellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResellers.fulfilled, (state, action) => {
        state.loading = false;
        state.resellers = action.payload;
      })
      .addCase(fetchResellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch reseller details
      .addCase(fetchResellerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResellerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReseller = action.payload;
      })
      .addCase(fetchResellerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create reseller
      .addCase(createReseller.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReseller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.resellers.push(action.payload);
      })
      .addCase(createReseller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add reseller admin
      .addCase(addResellerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addResellerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentReseller && state.currentReseller.reseller_id === action.payload.reseller) {
          if (!state.currentReseller.admins) {
            state.currentReseller.admins = [];
          }
          state.currentReseller.admins.push(action.payload.user_details);
        }
      })
      .addCase(addResellerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove reseller admin
      .addCase(removeResellerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeResellerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentReseller && state.currentReseller.reseller_id === action.payload.resellerId) {
          if (state.currentReseller.admins) {
            state.currentReseller.admins = state.currentReseller.admins.filter(
              admin => admin.email !== action.payload.email
            );
          }
        }
      })
      .addCase(removeResellerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch reseller customers
      .addCase(fetchResellerCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResellerCustomers.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Received customers data:", action.payload);
        // Make sure to handle both customers directly or nested in response format
        state.resellerCustomers = {
          ...state.resellerCustomers,
          [action.payload.resellerId]: Array.isArray(action.payload.customers) 
            ? action.payload.customers 
            : []
        };
      })
      .addCase(fetchResellerCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error fetching customers:", action.payload);
      })
      
      // Create reseller customer
      .addCase(createResellerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResellerCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const resellerId = action.payload.reseller;
        if (state.resellerCustomers[resellerId]) {
          state.resellerCustomers[resellerId].push(action.payload);
        } else {
          state.resellerCustomers[resellerId] = [action.payload];
        }
      })
      .addCase(createResellerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create reseller subscription
      .addCase(createResellerSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResellerSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createResellerSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearResellerErrors, setCurrentReseller } = resellerSlice.actions;

export default resellerSlice.reducer;
