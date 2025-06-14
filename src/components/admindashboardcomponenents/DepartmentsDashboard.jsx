import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDepartments, 
  createNewDepartment, 
  fetchDepartmentDetails, 
  updateDepartment, 
  deleteDepartment 
} from '@/redux/slices/departmentSlice';
import { openModal, closeModal } from '@/redux/slices/urlslice';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUser, FaEllipsisH, FaUserPlus } from 'react-icons/fa';

export default function DepartmentsDashboard() {
  const dispatch = useDispatch();
  const { departments, loading, error, currentDepartment } = useSelector(state => state.department);
  const { modalOpen, modalContent } = useSelector(state => state.ui);
  const [newDepartmentData, setNewDepartmentData] = useState({ name: '', description: '' });
  const [editDepartmentData, setEditDepartmentData] = useState({ name: '', description: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    dispatch(openModal({ type: 'createDepartment', data: {} }));
  };

  const handleOpenEditModal = (department) => {
    setEditDepartmentData({
      name: department.name,
      description: department.description || ''
    });
    setSelectedDepartmentId(department.department_id);
    dispatch(openModal({ type: 'editDepartment', data: { departmentId: department.department_id } }));
  };

  const handleOpenDeleteModal = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setConfirmDelete(false);
    dispatch(openModal({ type: 'deleteDepartment', data: { departmentId } }));
  };

  const handleCreateDepartment = () => {
    if (!newDepartmentData.name) {
      return;
    }
    dispatch(createNewDepartment(newDepartmentData));
    dispatch(closeModal());
    setNewDepartmentData({ name: '', description: '' });
  };

  const handleUpdateDepartment = () => {
    if (!editDepartmentData.name) {
      return;
    }
    dispatch(updateDepartment({
      departmentId: selectedDepartmentId,
      departmentData: editDepartmentData
    }));
    dispatch(closeModal());
  };

  const handleDeleteDepartment = () => {
    if (confirmDelete) {
      dispatch(deleteDepartment(selectedDepartmentId));
      dispatch(closeModal());
    } else {
      setConfirmDelete(true);
    }
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
                            title="View department details"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleOpenEditModal(department)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit department"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleOpenDeleteModal(department.department_id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete department"
                          >
                            <FaTrash />
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

      {/* Edit Department Modal */}
      {modalOpen && modalContent?.type === 'editDepartment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Department</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={editDepartmentData.name}
                  onChange={(e) => setEditDepartmentData({...editDepartmentData, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editDepartmentData.description}
                  onChange={(e) => setEditDepartmentData({...editDepartmentData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
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
                onClick={handleUpdateDepartment}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={!editDepartmentData.name.trim()}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Department Modal */}
      {modalOpen && modalContent?.type === 'deleteDepartment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Department</h2>
            {!confirmDelete ? (
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this department? This action cannot be undone.
              </p>
            ) : (
              <p className="text-red-600 font-medium mb-6">
                Please confirm that you want to permanently delete this department. This will remove all department data and cannot be undone.
              </p>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteDepartment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {confirmDelete ? 'Yes, Delete Department' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* View Department Modal */}
      {modalOpen && modalContent?.type === 'viewDepartment' && currentDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{currentDepartment.name}</h2>
              <button 
                onClick={() => dispatch(closeModal())}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Department Info</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p>{currentDepartment.department_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p>{new Date(currentDepartment.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Description</p>
                    <p>{currentDepartment.description || 'No description'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Department Admins</h3>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <FaUserPlus className="mr-1" /> Add Admin
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentDepartment.admins && currentDepartment.admins.length > 0 ? (
                      currentDepartment.admins.map((admin) => (
                        <tr key={admin.user_id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="font-medium">{admin.full_name}</div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm">{admin.email}</div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button 
                              className="text-red-600 hover:text-red-900"
                              title="Remove admin"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                          No admins found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Department Users</h3>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <FaUserPlus className="mr-1" /> Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentDepartment.users && currentDepartment.users.length > 0 ? (
                      currentDepartment.users.map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="font-medium">{user.full_name}</div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="text-sm">{user.email}</div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button 
                              className="text-red-600 hover:text-red-900"
                              title="Remove user"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
