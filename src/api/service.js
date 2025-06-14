import apiClient from './client';

// Service packages and subscription API functions
export const serviceAPI = {
  // List all service packages
  listServicePackages: async (activeOnly = true) => {
    try {
      const response = await apiClient.get(`/services/packages/?active_only=${activeOnly}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching service packages' };
    }
  },

  // Create a subscription
  createSubscription: async (subscriptionData) => {
    try {
      const response = await apiClient.post('/services/subscribe/', subscriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred creating subscription' };
    }
  },

  // Grant service access to a user
  grantServiceAccess: async (subscriptionId, userId) => {
    try {
      const response = await apiClient.post(`/services/subscription-users/${subscriptionId}/`, { user_id: userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred granting service access' };
    }
  }
};

export default serviceAPI;
