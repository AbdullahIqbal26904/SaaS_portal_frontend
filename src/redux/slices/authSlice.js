import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '@/api/auth';
import { setTokens } from '@/utils/tokenPersistence';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      // Store tokens using tokenManager (handles both cookies and localStorage)
      setTokens(response.tokens.access, response.tokens.refresh);
      return response;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      // Store tokens using tokenManager (handles both cookies and localStorage)
      if (response.tokens) {
        setTokens(response.tokens.access, response.tokens.refresh);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  adminDepartments: [],
  isAuthenticated: false,
  loading: false,
  error: null,
  tokens: {
    access: null,
    refresh: null
  }
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear tokens using tokenPersistence (handles cookies only)
      const { clearTokens } = require('@/utils/tokenPersistence');
      clearTokens();
      
      state.user = null;
      state.adminDepartments = [];
      state.isAuthenticated = false;
      state.error = null;
      state.tokens = { access: null, refresh: null };
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthTokens: (state, action) => {
      state.tokens = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.adminDepartments = action.payload.admin_departments || [];
        // Store tokens in Redux state
        if (action.payload.tokens) {
          state.tokens = action.payload.tokens;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Login failed' };
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.adminDepartments = action.payload.admin_departments || [];
        // Store tokens in Redux state
        if (action.payload.tokens) {
          state.tokens = action.payload.tokens;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Registration failed' };
      })
      
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch user profile' };
      });
  },
});

// Export actions
export const { logout, clearError, setAuthTokens } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
