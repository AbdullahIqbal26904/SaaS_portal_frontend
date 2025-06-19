import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDepartmentSubscriptions, 
  fetchServicePackages, 
  cancelSubscription,
  fetchSubscriptionUsers,
  grantServiceAccess,
  removeSubscriptionUser,
  setCurrentSubscription 
} from '@/redux/slices/serviceSlice';
import { FaPlusCircle, FaUserPlus, FaTrash, FaTimes, FaEye } from 'react-icons/fa';

export default function SubscriptionsManagement() {
  const dispatch = useDispatch();
  const { adminDepartments } = useSelector(state => state.department);
  const { 
    subscriptions, 
    servicePackages,
    currentSubscription,
    subscriptionUsers, 
    loading, 
    error, 
    success 
  } = useSelector(state => state.service);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isConfirmCancelModalOpen, setIsConfirmCancelModalOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
  const [newUserData, setNewUserData] = useState({
    userId: ''
  });
  
  useEffect(() => {
    if (adminDepartments && adminDepartments.length > 0) {
      const departmentId = adminDepartments[0].department_id;
      dispatch(fetchDepartmentSubscriptions(departmentId));
      dispatch(fetchServicePackages());
    }
  }, [adminDepartments, dispatch]);
  
  // When viewing subscription details, fetch users with access
  useEffect(() => {
    if (selectedSubscriptionId && isViewModalOpen) {
      dispatch(fetchSubscriptionUsers(selectedSubscriptionId));
    }
  }, [selectedSubscriptionId, isViewModalOpen, dispatch]);
  
  const handleViewSubscription = (subscriptionId) => {
    setSelectedSubscriptionId(subscriptionId);
    // Find the subscription in the list
    const subscription = subscriptions.find(sub => sub.id === subscriptionId);
    if (subscription) {
      dispatch(setCurrentSubscription(subscription));
    }
    setIsViewModalOpen(true);
  };
  
  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };
  
  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
    setNewUserData({ userId: '' });
  };
  
  const handleAddUserToSubscription = () => {
    if (!newUserData.userId || !selectedSubscriptionId) return;
    
    dispatch(grantServiceAccess({
      subscriptionId: selectedSubscriptionId,
      userId: parseInt(newUserData.userId)
    }));
    
    // Close modal on success
    if (success) {
      handleCloseAddUserModal();
    }
  };
  
  const handleRemoveUser = (userId) => {
    if (selectedSubscriptionId) {
      dispatch(removeSubscriptionUser({
        subscriptionId: selectedSubscriptionId,
        userId
      }));
    }
  };
  
  const handleCancelSubscription = (subscriptionId) => {
    setSelectedSubscriptionId(subscriptionId);
    setIsConfirmCancelModalOpen(true);
  };
  
  const confirmCancelSubscription = () => {
    if (selectedSubscriptionId) {
      dispatch(cancelSubscription(selectedSubscriptionId));
      setIsConfirmCancelModalOpen(false);
      setIsViewModalOpen(false);
    }
  };
  
  const getSubscriptionUsers = () => {
    return subscriptionUsers[selectedSubscriptionId] || [];
  };
  
  const getPackageName = (servicePackageId) => {
    const pkg = servicePackages.find(p => p.id === servicePackageId);
    return pkg ? pkg.name : 'Unknown Package';
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <button
          onClick={() => {}}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaPlusCircle className="mr-2" /> New Subscription
        </button>
      </div>
      
      {loading && <div className="text-center py-8">Loading subscriptions...</div>}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error.detail || 'An error occurred while loading subscriptions.'}
        </div>
      )}
      
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions && subscriptions.length > 0 ? (
                  subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {subscription.service_package_details?.service?.name || 'Unknown Service'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>{getPackageName(subscription.service_package)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(subscription.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleViewSubscription(subscription.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye className="inline mr-1" /> View
                        </button>
                        <button
                          onClick={() => handleCancelSubscription(subscription.id)}
                          className="text-red-600 hover:text-red-900 ml-3"
                        >
                          <FaTimes className="inline mr-1" /> Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No subscriptions found for this department.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* View Subscription Modal */}
      {isViewModalOpen && currentSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {currentSubscription.service_package_details?.service?.name || 'Subscription'} Details
              </h2>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Subscription Info */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{currentSubscription.service_package_details?.service?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Package</p>
                <p className="font-medium">{getPackageName(currentSubscription.service_package)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{new Date(currentSubscription.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </p>
              </div>
              {currentSubscription.service_package_details?.description && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p>{currentSubscription.service_package_details.description}</p>
                </div>
              )}
            </div>
            
            {/* Users with Access */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Users with Access</h3>
                <button 
                  onClick={handleOpenAddUserModal}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FaUserPlus className="mr-1" /> Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Granted</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getSubscriptionUsers().length > 0 ? (
                      getSubscriptionUsers().map((subUser) => (
                        <tr key={subUser.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="font-medium">{subUser.user_details?.full_name}</div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm">{subUser.user_details?.email}</div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                            {new Date(subUser.granted_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-right">
                            <button 
                              onClick={() => handleRemoveUser(subUser.user)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                          No users have access to this subscription.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => handleCancelSubscription(currentSubscription.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add User to Subscription Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add User to Subscription</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input
                  type="number"
                  value={newUserData.userId}
                  onChange={(e) => setNewUserData({...newUserData, userId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter user ID"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the ID of the user you want to grant access to.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={handleCloseAddUserModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddUserToSubscription}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!newUserData.userId}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Cancel Subscription Modal */}
      {isConfirmCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Cancel Subscription</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this subscription? This action cannot be undone and 
              all users will lose access to the service.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsConfirmCancelModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                No, Keep Subscription
              </button>
              <button 
                onClick={confirmCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
