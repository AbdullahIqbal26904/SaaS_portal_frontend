import apiClient from './client';

const resellerAPI = {
  // List all resellers
  getResellers: async () => {
    const response = await apiClient.get('/resellers/resellers/');
    return response.data;
  },

  // Get a specific reseller's details
  getResellerDetails: async (resellerId) => {
    const response = await apiClient.get(`/resellers/resellers/${resellerId}/`);
    return response.data;
  },

  // Create a new reseller (root admin only)
  createReseller: async (resellerData) => {
    const response = await apiClient.post('/resellers/resellers/', resellerData);
    return response.data;
  },

  // Add reseller admin
  addResellerAdmin: async (resellerId, adminData) => {
    const response = await apiClient.post(`/resellers/resellers/${resellerId}/admins/`, adminData);
    return response.data;
  },

  // Remove reseller admin
  removeResellerAdmin: async (resellerId, email) => {
    const response = await apiClient.delete(`/resellers/resellers/${resellerId}/admins/`, { 
      data: { email } 
    });
    return response.data;
  },

  // List all customers for a reseller
  getResellerCustomers: async (resellerId) => {
    try {
      console.log(`Fetching customers for reseller ID: ${resellerId}`);
      const response = await apiClient.get(`/resellers/resellers/${resellerId}/customers/`);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error fetching customers:", error.message);
      throw error;
    }
  },

  // Create a new customer for a reseller
  createResellerCustomer: async (resellerId, customerData) => {
    const response = await apiClient.post(`/resellers/resellers/${resellerId}/customers/`, customerData);
    return response.data;
  },

  // Remove a customer from a reseller
  removeResellerCustomer: async (resellerId, customerId) => {
    const response = await apiClient.delete(`/resellers/resellers/${resellerId}/customers/${customerId}/`);
    return response.data;
  },

  // Create subscription for a reseller customer
  createResellerSubscription: async (resellerId, subscriptionData) => {
    const response = await apiClient.post(`/resellers/resellers/${resellerId}/subscriptions/`, subscriptionData);
    return response.data;
  }
};

export default resellerAPI;
