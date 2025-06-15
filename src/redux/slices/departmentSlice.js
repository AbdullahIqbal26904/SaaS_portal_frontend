import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import departmentAPI from '@/api/department';

// Async thunks for departments
export const fetchDepartments = createAsyncThunk(
  'department/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.listDepartments();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDepartmentDetails = createAsyncThunk(
  'department/fetchDepartmentDetails',
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.getDepartmentDetails(departmentId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNewDepartment = createAsyncThunk(
  'department/createNewDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.createDepartment(departmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'department/updateDepartment',
  async ({ departmentId, departmentData }, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.updateDepartment(departmentId, departmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'department/deleteDepartment',
  async (departmentId, { rejectWithValue }) => {
    try {
      await departmentAPI.deleteDepartment(departmentId);
      return departmentId; // Return the ID for state updates
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addDepartmentAdmin = createAsyncThunk(
  'department/addDepartmentAdmin',
  async ({ departmentId, adminData }, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.addDepartmentAdmin(departmentId, adminData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeDepartmentAdmin = createAsyncThunk(
  'department/removeDepartmentAdmin',
  async ({ departmentId, email }, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.removeDepartmentAdmin(departmentId, email);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Initial state
const initialState = {
  departments: [],
  currentDepartment: null,
  loading: false,
  error: null,
  success: false,
};

// Department slice
const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    clearDepartmentError: (state) => {
      state.error = null;
      state.success = false;
    },
    clearCurrentDepartment: (state) => {
      state.currentDepartment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch departments cases
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch departments' };
      })
      
      // Fetch department details cases
      .addCase(fetchDepartmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDepartment = action.payload;
      })
      .addCase(fetchDepartmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch department details' };
      })
      
      // Create department cases
      .addCase(createNewDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = [...state.departments, action.payload];
        state.success = true;
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to create department' };
      })
      
      // Update department cases
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the department in the list
        state.departments = state.departments.map(department =>
          department.department_id === action.payload.department_id ? action.payload : department
        );
        // Update current department if it's the one being updated
        if (state.currentDepartment && state.currentDepartment.department_id === action.payload.department_id) {
          state.currentDepartment = action.payload;
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to update department' };
      })
      
      // Delete department cases
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove the department from the list
        state.departments = state.departments.filter(
          department => department.department_id !== action.payload
        );
        // Clear current department if it's the one being deleted
        if (state.currentDepartment && state.currentDepartment.department_id === action.payload) {
          state.currentDepartment = null;
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to delete department' };
      })
      
      // Add admin cases
      .addCase(addDepartmentAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addDepartmentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update current department if it matches
        if (state.currentDepartment && state.currentDepartment.department_id === action.payload.department) {
          state.currentDepartment.admins = [...state.currentDepartment.admins, action.payload.user_details];
        }
      })
      .addCase(addDepartmentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to add department admin' };
      })
      
      // Remove admin cases
      .addCase(removeDepartmentAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(removeDepartmentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove admin from current department if it's loaded
        if (state.currentDepartment) {
          // The payload may just be a 204 No Content, so we'll have to use the email from the request
          const removedEmail = action.meta.arg.email;
          state.currentDepartment.admins = state.currentDepartment.admins.filter(
            admin => admin.email !== removedEmail
          );
        }
      })
      .addCase(removeDepartmentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to remove department admin' };
      });
  },
});

// Export actions
export const { clearDepartmentError, clearCurrentDepartment } = departmentSlice.actions;

// Export reducer
export default departmentSlice.reducer;
