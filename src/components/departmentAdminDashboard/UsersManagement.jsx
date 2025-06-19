import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserPlus, FaTrash, FaSearch } from 'react-icons/fa';
import { addUserToDepartment, removeUserFromDepartment } from '@/redux/slices/departmentSlice';

export default function UsersManagement() {
  const dispatch = useDispatch();
  const { adminDepartments, currentDepartment, loading, error, success } = useSelector(state => state.department);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    full_name: '',
    password: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const getCurrentDepartment = () => {
    return currentDepartment || (adminDepartments && adminDepartments.length > 0 ? adminDepartments[0] : null);
  };
  
  const department = getCurrentDepartment();
  
  // Reset form state after successful operation
  useEffect(() => {
    if (success) {
      setIsAddModalOpen(false);
      setUserData({
        email: '',
        full_name: '',
        password: ''
      });
      setConfirmDelete(null);
    }
  }, [success]);
  
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };
  
  const handleAddUser = () => {
    if (!userData.email || !userData.full_name) return;
    
    if (department) {
      dispatch(addUserToDepartment({
        departmentId: department.department_id,
        userData: {
          email: userData.email,
          full_name: userData.full_name,
          password: userData.password || undefined
        }
      }));
    }
  };
  
  const handleRemoveUser = (email) => {
    if (confirmDelete === email) {
      if (department) {
        dispatch(removeUserFromDepartment({
          departmentId: department.department_id,
          email
        }));
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(email);
    }
  };
  
  const getFilteredUsers = () => {
    if (!department || !department.users) return [];
    
    return department.users.filter(user => 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const filteredUsers = getFilteredUsers();
  
  if (!department) {
    return <div>Loading department information...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Department Users</h1>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FaUserPlus className="mr-2" /> Add User
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.full_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleRemoveUser(user.email)}
                        className={`${
                          confirmDelete === user.email 
                            ? 'bg-red-600 text-white' 
                            : 'text-red-600 hover:text-red-900'
                        } px-3 py-1 rounded-md ${confirmDelete === user.email ? 'hover:bg-red-700' : ''}`}
                      >
                        {confirmDelete === user.email ? 'Confirm' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No users found matching your search.' : 'No users found in this department.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add User to Department</h2>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error.detail || 'An error occurred. Please try again.'}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  value={userData.full_name}
                  onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (Only required for new users)
                </label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Leave blank for existing users"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank if the user already exists in the system.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={handleCloseAddModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading || !userData.email || !userData.full_name}
              >
                {loading ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
