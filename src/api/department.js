import apiClient from './client';

// Department API functions
export const departmentAPI = {
  // List all departments
  listDepartments: async () => {
    try {
      const response = await apiClient.get('/departments/departments/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching departments' };
    }
  },

  // Create a new department
  createDepartment: async (departmentData) => {
    try {
      const response = await apiClient.post('/departments/departments/', departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred creating department' };
    }
  },

  // Get department details by ID
  getDepartmentDetails: async (departmentId) => {
    try {
      const response = await apiClient.get(`/departments/departments/${departmentId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching department details' };
    }
  },

  // Update department by ID
  updateDepartment: async (departmentId, departmentData) => {
    try {
      const response = await apiClient.put(`/departments/departments/${departmentId}/`, departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred updating department' };
    }
  },

  // Delete department by ID
  deleteDepartment: async (departmentId) => {
    try {
      const response = await apiClient.delete(`/departments/departments/${departmentId}/`);
      return response.status === 204 ? { success: true } : response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred deleting department' };
    }
  },

  // Add department admin
  addDepartmentAdmin: async (departmentId, adminData) => {
    try {
      const response = await apiClient.post(`/departments/departments/${departmentId}/admins/`, adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred adding department admin' };
    }
  },

  // Remove department admin
  removeDepartmentAdmin: async (departmentId, email) => {
    try {
      const response = await apiClient.delete(`/departments/departments/${departmentId}/admins/`, { 
        data: { email }
      });
      return response.status === 204 ? { success: true } : response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred removing department admin' };
    }
  },

  // Get current admin's departments
  getMyAdminDepartments: async () => {
    try {
      const response = await apiClient.get('/departments/me/admin/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching admin departments' };
    }
  },

  // Add user to department
  addUserToDepartment: async (departmentId, userData) => {
    try {
      const response = await apiClient.post(`/departments/departments/${departmentId}/users/`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred adding user to department' };
    }
  },

  // Remove user from department
  removeUserFromDepartment: async (departmentId, email) => {
    try {
      const response = await apiClient.delete(`/departments/departments/${departmentId}/users/`, {
        data: { email }
      });
      return response.status === 204 ? { success: true } : response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred removing user from department' };
    }
  },
  
  // Get department admins
  getDepartmentAdmins: async (departmentId) => {
    try {
      const response = await apiClient.get(`/departments/departments/${departmentId}/admins/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching department admins' };
    }
  },
  
  // Get department users
  getDepartmentUsers: async (departmentId) => {
    try {
      const response = await apiClient.get(`/departments/departments/${departmentId}/users/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching department users' };
    }
  }
};

export default departmentAPI;
