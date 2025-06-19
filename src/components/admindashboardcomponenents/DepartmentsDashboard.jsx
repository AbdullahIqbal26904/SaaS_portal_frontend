import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDepartments, 
  createNewDepartment, 
  fetchDepartmentDetails, 
  updateDepartment, 
  deleteDepartment,
  addDepartmentAdmin,
  removeDepartmentAdmin,
  addUserToDepartment,
  removeUserFromDepartment,
  clearDepartmentError
} from '@/redux/slices/departmentSlice';
import { openModal, closeModal } from '@/redux/slices/urlslice';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUser, FaEllipsisH, FaUserPlus } from 'react-icons/fa';
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function DepartmentsDashboard() {
  const dispatch = useDispatch();
  const { departments, loading, error, currentDepartment, success } = useSelector(state => state.department);
  const { modalOpen, modalContent } = useSelector(state => state.ui);
  const [newDepartmentData, setNewDepartmentData] = useState({ name: '', description: '' });
  const [editDepartmentData, setEditDepartmentData] = useState({ name: '', description: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [adminData, setAdminData] = useState({ email: '', full_name: '', password: '' });
  const [userData, setUserData] = useState({ email: '', full_name: '', password: '' });
  const [removeEmail, setRemoveEmail] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Clear form states when the modal closes
  useEffect(() => {
    if (!modalOpen) {
      setAdminData({ email: '', full_name: '', password: '' });
      setUserData({ email: '', full_name: '', password: '' });
      setRemoveEmail('');
    }
  }, [modalOpen]);

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

  // Admin management functions
  const handleAddAdminModal = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    dispatch(openModal({ type: 'addAdmin', data: { departmentId } }));
  };

  const handleAddAdmin = () => {
    if (!adminData.email || !adminData.full_name) {
      return;
    }
    dispatch(addDepartmentAdmin({
      departmentId: selectedDepartmentId,
      adminData
    }));
    dispatch(closeModal());
  };

  const handleRemoveAdminModal = (departmentId, email) => {
    setSelectedDepartmentId(departmentId);
    setRemoveEmail(email);
    dispatch(openModal({ type: 'removeAdmin', data: { departmentId, email } }));
  };

  const handleRemoveAdmin = () => {
    dispatch(removeDepartmentAdmin({
      departmentId: selectedDepartmentId,
      email: removeEmail
    }));
    dispatch(closeModal());
  };

  // User management functions
  const handleAddUserModal = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    dispatch(openModal({ type: 'addUser', data: { departmentId } }));
  };

  const handleAddUser = () => {
    if (!userData.email || !userData.full_name) {
      return;
    }
    dispatch(addUserToDepartment({
      departmentId: selectedDepartmentId,
      userData
    }));
    dispatch(closeModal());
  };

  const handleRemoveUserModal = (departmentId, email) => {
    setSelectedDepartmentId(departmentId);
    setRemoveEmail(email);
    dispatch(openModal({ type: 'removeUser', data: { departmentId, email } }));
  };

  const handleRemoveUser = () => {
    dispatch(removeUserFromDepartment({
      departmentId: selectedDepartmentId,
      email: removeEmail
    }));
    dispatch(closeModal());
  };

  const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }, [onClose]);
    
    let bgColor, icon;
    switch (type) {
      case 'success':
        bgColor = 'bg-green-50 border-green-500 text-green-700';
        icon = <FaCheck className="text-green-500" />;
        break;
      case 'error':
        bgColor = 'bg-red-50 border-red-500 text-red-700';
        icon = <FaExclamationTriangle className="text-red-500" />;
        break;
      default:
        bgColor = 'bg-blue-50 border-blue-500 text-blue-700';
        icon = <i className="fas fa-info-circle text-blue-500"></i>;
    }
    
    return (
      <div className={`fixed top-5 right-5 p-4 rounded-md border-l-4 ${bgColor} shadow-md z-50 max-w-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">{icon}</div>
            <p>{message}</p>
          </div>
          <button onClick={onClose} className="ml-6 text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
      </div>
    );
  };

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification({ show: false, message: '', type: '' });
  }, []);

  const actionType = useSelector(state => state.department.actionType);
  
  useEffect(() => {
    if (success) {
      let message = '';
      
      switch (actionType) {
        case 'add_department_admin':
          message = 'Department admin added successfully';
          break;
        case 'remove_department_admin':
          message = 'Department admin removed successfully';
          break;
        case 'add_department_user':
          message = 'User added to department successfully';
          break;
        case 'remove_department_user':
          message = 'User removed from department successfully';
          break;
        case 'create_department':
          message = 'Department created successfully';
          break;
        case 'update_department':
          message = 'Department updated successfully';
          break;
        case 'delete_department':
          message = 'Department deleted successfully';
          break;
        default:
          message = 'Operation completed successfully';
      }
      
      showNotification(message, 'success');
      dispatch(clearDepartmentError());
    }
    
    if (error) {
      const errorMessage = error.detail || 'An error occurred';
      showNotification(errorMessage, 'error');
    }
  }, [success, error, actionType, dispatch, showNotification]);

  return (
    <div>
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={closeNotification} 
        />
      )}
      
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

      {/* Add Admin Modal */}
      {modalOpen && modalContent?.type === 'addAdmin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Department Admin</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={adminData.email}
                  onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={adminData.full_name}
                  onChange={(e) => setAdminData({...adminData, full_name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Admin Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (Optional if user already exists)
                </label>
                <input
                  type="password"
                  value={adminData.password}
                  onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Leave blank if user exists"
                />
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
                onClick={handleAddAdmin}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!adminData.email || !adminData.full_name}
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Admin Modal */}
      {modalOpen && modalContent?.type === 'removeAdmin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Remove Department Admin</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to remove {removeEmail} as an admin from this department?
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRemoveAdmin}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remove Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {modalOpen && modalContent?.type === 'addUser' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Department User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={userData.full_name}
                  onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="User Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (Optional if user already exists)
                </label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Leave blank if user exists"
                />
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
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!userData.email || !userData.full_name}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove User Modal */}
      {modalOpen && modalContent?.type === 'removeUser' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Remove User from Department</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to remove {removeEmail} from this department?
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRemoveUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
