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
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await apiClient.delete(`/services/subscriptions/${subscriptionId}/`);
      return response.status === 204 ? { success: true } : response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred canceling subscription' };
    }
  },
  
  // List department subscriptions
  listDepartmentSubscriptions: async (departmentId) => {
    try {
      const response = await apiClient.get(`/services/subscriptions/department/${departmentId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching department subscriptions' };
    }
  },

  // List users with access to a subscription
  listSubscriptionUsers: async (subscriptionId) => {
    try {
      const response = await apiClient.get(`/services/subscription-users/${subscriptionId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred fetching subscription users' };
    }
  },

  // Remove user access to a subscription
  removeSubscriptionUser: async (subscriptionId, userId) => {
    try {
      const response = await apiClient.delete(`/services/subscription-users/${subscriptionId}/user/${userId}/`);
      return response.status === 204 ? { success: true } : response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'An error occurred removing user access' };
    }
  }
};

export default serviceAPI;
