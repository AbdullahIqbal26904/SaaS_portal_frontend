import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments, createNewDepartment, fetchDepartmentDetails } from '@/redux/slices/departmentSlice';
import { openModal, closeModal } from '@/redux/slices/urlslice';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUser, FaEllipsisH, FaUserPlus } from 'react-icons/fa';

export default function DepartmentsDashboard() {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(state => state.department);
  const { modalOpen, modalContent } = useSelector(state => state.ui);
  const [newDepartmentData, setNewDepartmentData] = useState({ name: '', description: '' });

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    dispatch(openModal({ type: 'createDepartment', data: {} }));
  };

  const handleCreateDepartment = () => {
    if (!newDepartmentData.name) {
      return;
    }
    dispatch(createNewDepartment(newDepartmentData));
    dispatch(closeModal());
    setNewDepartmentData({ name: '', description: '' });
  };

  const handleViewDepartment = (departmentId) => {
    dispatch(fetchDepartmentDetails(departmentId));
    dispatch(openModal({ type: 'viewDepartment', data: { departmentId } }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Departments</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Department
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading departments: {error.detail || 'Unknown error'}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.length > 0 ? (
                  departments.map((department) => (
                    <tr key={department.department_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{department.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {department.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUsers className="mr-2 text-gray-400" />
                          <span>
                            {/* This would need actual user count data */}
                            0 users
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(department.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3 justify-center">
                          <button 
                            onClick={() => handleViewDepartment(department.department_id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <FaEllipsisH />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                      No departments found. Create your first department to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Department Modal */}
      {modalOpen && modalContent?.type === 'createDepartment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Department</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={newDepartmentData.name}
                  onChange={(e) => setNewDepartmentData({...newDepartmentData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newDepartmentData.description}
                  onChange={(e) => setNewDepartmentData({...newDepartmentData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Describe the department's purpose..."
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateDepartment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!newDepartmentData.name.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
