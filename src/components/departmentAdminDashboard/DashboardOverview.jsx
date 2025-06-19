import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDepartments, updateDepartment } from '@/redux/slices/departmentSlice';
import { fetchDepartmentSubscriptions } from '@/redux/slices/serviceSlice';
import { FaEdit, FaUsers, FaCreditCard, FaShieldAlt } from 'react-icons/fa';

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const { adminDepartments, currentDepartment, loading, error } = useSelector(state => state.department);
  const { subscriptions } = useSelector(state => state.service);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [departmentData, setDepartmentData] = useState({
    name: '',
    description: ''
  });
  
  useEffect(() => {
    if (adminDepartments && adminDepartments.length > 0) {
      const departmentId = adminDepartments[0].department_id;
      dispatch(fetchDepartmentSubscriptions(departmentId));
    }
  }, [adminDepartments, dispatch]);
  
  useEffect(() => {
    if (currentDepartment) {
      setDepartmentData({
        name: currentDepartment.name,
        description: currentDepartment.description || ''
      });
    } else if (adminDepartments && adminDepartments.length > 0) {
      setDepartmentData({
        name: adminDepartments[0].name,
        description: adminDepartments[0].description || ''
      });
    }
  }, [currentDepartment, adminDepartments]);
  
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  
  const handleUpdateDepartment = () => {
    if (adminDepartments && adminDepartments.length > 0) {
      const departmentId = adminDepartments[0].department_id;
      dispatch(updateDepartment({
        departmentId,
        departmentData: {
          name: departmentData.name,
          description: departmentData.description
        }
      }));
      setIsEditModalOpen(false);
    }
  };
  
  const getCurrentDepartment = () => {
    return currentDepartment || (adminDepartments && adminDepartments.length > 0 ? adminDepartments[0] : null);
  };
  
  const department = getCurrentDepartment();
  
  if (!department) {
    return <div>Loading department information...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Department Dashboard</h1>
        <button
          onClick={handleOpenEditModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaEdit className="mr-2" /> Edit Department
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Users</h2>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {department.users ? department.users.length : 0}
          </div>
          <p className="text-gray-500 mt-1">Total Department Users</p>
        </div>
        
        {/* Admins Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Admins</h2>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaShieldAlt className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {department.admins ? department.admins.length : 0}
          </div>
          <p className="text-gray-500 mt-1">Department Administrators</p>
        </div>
        
        {/* Subscriptions Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Subscriptions</h2>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaCreditCard className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {subscriptions ? subscriptions.length : 0}
          </div>
          <p className="text-gray-500 mt-1">Active Subscriptions</p>
        </div>
      </div>
      
      {/* Department Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Department Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 mb-1">Department Name</p>
            <p className="font-medium">{department.name}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Created On</p>
            <p className="font-medium">{new Date(department.created_at).toLocaleDateString()}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="text-gray-500 mb-1">Description</p>
            <p>{department.description || 'No description provided.'}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Subscriptions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Subscriptions</h2>
        {subscriptions && subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.slice(0, 5).map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {subscription.service_package_details?.service?.name || 'Unknown Service'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{subscription.service_package_details?.name || 'Basic Plan'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(subscription.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No subscriptions found.
          </div>
        )}
      </div>
      
      {/* Edit Department Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Department</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={departmentData.name}
                  onChange={(e) => setDepartmentData({...departmentData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={departmentData.description}
                  onChange={(e) => setDepartmentData({...departmentData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={handleCloseEditModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateDepartment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!departmentData.name.trim()}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
