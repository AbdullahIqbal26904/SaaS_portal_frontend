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

export const fetchAdminDepartments = createAsyncThunk(
  'department/fetchAdminDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.getMyAdminDepartments();
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
      await departmentAPI.removeDepartmentAdmin(departmentId, email);
      return { departmentId, email };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addUserToDepartment = createAsyncThunk(
  'department/addUserToDepartment',
  async ({ departmentId, userData }, { rejectWithValue }) => {
    try {
      const response = await departmentAPI.addUserToDepartment(departmentId, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeUserFromDepartment = createAsyncThunk(
  'department/removeUserFromDepartment',
  async ({ departmentId, email }, { rejectWithValue }) => {
    try {
      await departmentAPI.removeUserFromDepartment(departmentId, email);
      return { departmentId, email };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Initial state
const initialState = {
  departments: [],
  adminDepartments: [], // Departments where the current user is an admin
  currentDepartment: null,
  loading: false,
  error: null,
  success: false,
  actionType: null, // To track the type of action that succeeded or failed
};

// Department slice
const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    clearDepartmentError: (state) => {
      state.error = null;
      state.success = false;
      state.actionType = null;
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
        state.actionType = 'fetch_departments';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
        state.actionType = 'fetch_departments';
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch departments' };
        state.actionType = 'fetch_departments';
      })
      
      // Fetch department details cases
      .addCase(fetchDepartmentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.actionType = 'fetch_department_details';
      })
      .addCase(fetchDepartmentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDepartment = action.payload;
        state.actionType = 'fetch_department_details';
      })
      .addCase(fetchDepartmentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch department details' };
        state.actionType = 'fetch_department_details';
      })
      
      // Fetch admin departments cases
      .addCase(fetchAdminDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.actionType = 'fetch_admin_departments';
      })
      .addCase(fetchAdminDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.adminDepartments = action.payload;
        state.actionType = 'fetch_admin_departments';
        
        // If there's only one department, set it as current
        if (action.payload.length === 1) {
          state.currentDepartment = action.payload[0];
        }
      })
      .addCase(fetchAdminDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to fetch admin departments' };
        state.actionType = 'fetch_admin_departments';
      })
      
      // Create department cases
      .addCase(createNewDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'create_department';
      })
      .addCase(createNewDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = [...state.departments, action.payload];
        state.success = true;
        state.actionType = 'create_department';
      })
      .addCase(createNewDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to create department' };
        state.actionType = 'create_department';
      })
      
      // Update department cases
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'update_department';
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.actionType = 'update_department';
        
        // Update the department in the list
        state.departments = state.departments.map(department =>
          department.department_id === action.payload.department_id ? action.payload : department
        );
        
        // Update admin departments list if it exists
        if (state.adminDepartments.length > 0) {
          state.adminDepartments = state.adminDepartments.map(department =>
            department.department_id === action.payload.department_id ? action.payload : department
          );
        }
        
        // Update current department if it's the one being updated
        if (state.currentDepartment && state.currentDepartment.department_id === action.payload.department_id) {
          state.currentDepartment = action.payload;
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to update department' };
        state.actionType = 'update_department';
      })
      
      // Delete department cases
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'delete_department';
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.actionType = 'delete_department';
        
        // Remove the department from the list
        state.departments = state.departments.filter(
          department => department.department_id !== action.payload
        );
        
        // Remove from admin departments if present
        if (state.adminDepartments.length > 0) {
          state.adminDepartments = state.adminDepartments.filter(
            department => department.department_id !== action.payload
          );
        }
        
        // Clear current department if it's the one being deleted
        if (state.currentDepartment && state.currentDepartment.department_id === action.payload) {
          state.currentDepartment = null;
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to delete department' };
        state.actionType = 'delete_department';
      })
      
      // Add admin cases
      .addCase(addDepartmentAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'add_department_admin';
      })
      .addCase(addDepartmentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.actionType = 'add_department_admin';
        
        // Update current department if it matches
        if (state.currentDepartment && state.currentDepartment.department_id === action.payload.department) {
          // If admins array doesn't exist yet, create it
          if (!state.currentDepartment.admins) {
            state.currentDepartment.admins = [];
          }
          
          state.currentDepartment.admins = [
            ...state.currentDepartment.admins, 
            action.payload.user_details
          ];
        }
      })
      .addCase(addDepartmentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to add department admin' };
        state.actionType = 'add_department_admin';
      })
      
      // Remove admin cases
      .addCase(removeDepartmentAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'remove_department_admin';
      })
      .addCase(removeDepartmentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.actionType = 'remove_department_admin';
        
        // Remove admin from current department if it's loaded
        if (state.currentDepartment && state.currentDepartment.admins) {
          const removedEmail = action.payload.email;
          state.currentDepartment.admins = state.currentDepartment.admins.filter(
            admin => admin.email !== removedEmail
          );
        }
      })
      .addCase(removeDepartmentAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to remove department admin' };
        state.actionType = 'remove_department_admin';
      })
      
      // Add user to department cases
      .addCase(addUserToDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'add_department_user';
      })
      .addCase(addUserToDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.actionType = 'add_department_user';
        
        // Update current department if it matches
        if (state.currentDepartment && state.currentDepartment.department_id === action.payload.department) {
          // If users array doesn't exist yet, create it
          if (!state.currentDepartment.users) {
            state.currentDepartment.users = [];
          }
          
          state.currentDepartment.users = [
            ...state.currentDepartment.users, 
            action.payload.user_details
          ];
        }
      })
      .addCase(addUserToDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to add user to department' };
        state.actionType = 'add_department_user';
      })
      
      // Remove user from department cases
      .addCase(removeUserFromDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'remove_department_user';
      })
      .addCase(removeUserFromDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.actionType = 'remove_department_user';
        
        // Remove user from current department if it's loaded and has users
        if (state.currentDepartment && state.currentDepartment.users) {
          const removedEmail = action.payload.email;
          state.currentDepartment.users = state.currentDepartment.users.filter(
            user => user.email !== removedEmail
          );
        }
      })
      .addCase(removeUserFromDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { detail: 'Failed to remove user from department' };
        state.actionType = 'remove_department_user';
      });
  },
});

// Export actions
export const { clearDepartmentError, clearCurrentDepartment } = departmentSlice.actions;

// Export reducer
export default departmentSlice.reducer;
