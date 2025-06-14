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
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred removing department admin' };
    }
  },
};

export default departmentAPI;
