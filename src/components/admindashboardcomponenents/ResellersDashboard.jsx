import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { FaUserCheck } from 'react-icons/fa6';
import { 
  fetchResellers, 
  fetchResellerDetails, 
  createReseller, 
  addResellerAdmin,
  removeResellerAdmin,
  clearResellerErrors
} from '@/redux/slices/resellerSlice';

// Component for resellers dashboard - for root admin only
export default function ResellersDashboard() {
  const dispatch = useDispatch();
  const { resellers, currentReseller, loading, error, success } = useSelector(state => state.reseller);
  
  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedResellerId, setSelectedResellerId] = useState(null);
  const [newReseller, setNewReseller] = useState({
    name: '',
    description: '',
    is_active: true,
    commission_rate: '10.00'
  });
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    full_name: '',
    password: ''
  });

  // Load resellers on component mount
  useEffect(() => {
    dispatch(fetchResellers());
  }, [dispatch]);

  // Reset form after successful reseller creation
  useEffect(() => {
    if (success) {
      if (showAddModal) {
        setShowAddModal(false);
        setNewReseller({
          name: '',
          description: '',
          is_active: true,
          commission_rate: '10.00'
        });
      }
      if (showAddAdminModal) {
        setShowAddAdminModal(false);
        setNewAdmin({
          email: '',
          full_name: '',
          password: ''
        });
      }
      // Clear success state after handling it
      setTimeout(() => {
        dispatch(clearResellerErrors());
      }, 2000);
    }
  }, [success, dispatch, showAddModal, showAddAdminModal]);

  // Handle adding a new reseller
  const handleAddReseller = (e) => {
    e.preventDefault();
    dispatch(createReseller(newReseller));
  };

  // Handle adding an admin to a reseller
  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (selectedResellerId) {
      dispatch(addResellerAdmin({
        resellerId: selectedResellerId,
        adminData: newAdmin
      }));
    }
  };

  // Handle removing an admin from a reseller
  const handleRemoveAdmin = (email) => {
    if (selectedResellerId) {
      if (confirm('Are you sure you want to remove this admin?')) {
        dispatch(removeResellerAdmin({
          resellerId: selectedResellerId,
          email: email
        }));
      }
    }
  };

  // Handle view reseller details
  const handleViewDetails = (resellerId) => {
    dispatch(fetchResellerDetails(resellerId));
    setSelectedResellerId(resellerId);
  };

  // Filter and sort resellers
  const getFilteredAndSortedResellers = () => {
    let filtered = [...(resellers || [])];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reseller => 
        reseller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(reseller => 
        (statusFilter === 'active' && reseller.is_active) ||
        (statusFilter === 'inactive' && !reseller.is_active)
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      // Handle dates
      if (sortField === 'created_at' || sortField === 'updated_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      
      if (sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    
    return filtered;
  };

  // Get filtered and sorted resellers
  const filteredResellers = resellers ? getFilteredAndSortedResellers() : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resellers & Partners</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center">
          <FaPlus className="mr-2" /> Add Reseller
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Operation completed successfully!
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <input 
                type="text" 
                placeholder="Search resellers..." 
                className="px-4 py-2 border rounded-md w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select 
                className="px-4 py-2 border rounded-md mr-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Status: All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select 
                className="px-4 py-2 border rounded-md"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}>
                <option value="created_at">Sort By: Newest</option>
                <option value="name">Name</option>
                <option value="commission_rate">Commission Rate</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="py-10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading resellers...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Reseller</th>
                    <th className="py-3 px-6 text-left">Description</th>
                    <th className="py-3 px-6 text-left">Commission Rate</th>
                    <th className="py-3 px-6 text-left">Join Date</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {filteredResellers.length > 0 ? (
                    filteredResellers.map(reseller => (
                      <tr key={reseller.reseller_id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">
                          <div className="font-medium">{reseller.name}</div>
                        </td>
                        <td className="py-3 px-6 text-left">{reseller.description || 'N/A'}</td>
                        <td className="py-3 px-6 text-left">{reseller.commission_rate}%</td>
                        <td className="py-3 px-6 text-left">
                          {new Date(reseller.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reseller.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reseller.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center gap-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleViewDetails(reseller.reseller_id)}
                              title="View Details">
                              <FaEdit />
                            </button>
                            <button 
                              className="text-green-600 hover:text-green-900"
                              onClick={() => {
                                setSelectedResellerId(reseller.reseller_id);
                                setShowAddAdminModal(true);
                              }}
                              title="Add Admin">
                              <FaUserPlus />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        {searchTerm || statusFilter ? 
                          "No resellers match your filters" : 
                          "No resellers found. Create a new one to get started."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              {filteredResellers.length > 0 ? 
                `Showing ${filteredResellers.length} resellers` : 
                'No resellers to display'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Reseller Details Panel */}
      {currentReseller && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{currentReseller.name} - Details</h2>
            <button 
              onClick={() => dispatch(fetchResellerDetails(null))}
              className="text-blue-600 hover:underline">
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Reseller Information</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><span className="font-medium">ID:</span> {currentReseller.reseller_id}</p>
                <p><span className="font-medium">Name:</span> {currentReseller.name}</p>
                <p><span className="font-medium">Description:</span> {currentReseller.description || 'N/A'}</p>
                <p><span className="font-medium">Status:</span> {currentReseller.is_active ? 'Active' : 'Inactive'}</p>
                <p><span className="font-medium">Commission Rate:</span> {currentReseller.commission_rate}%</p>
                <p><span className="font-medium">Created:</span> {new Date(currentReseller.created_at).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Admins</h3>
                <button 
                  onClick={() => {
                    setShowAddAdminModal(true);
                  }}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded flex items-center">
                  <FaUserPlus className="mr-1" /> Add Admin
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                {currentReseller.admins && currentReseller.admins.length > 0 ? (
                  <ul className="divide-y">
                    {currentReseller.admins.map(admin => (
                      <li key={admin.user_id} className="py-2">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <p className="font-medium">{admin.full_name}</p>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUserCheck className="text-green-500" title="Active Admin" />
                            <button 
                              onClick={() => handleRemoveAdmin(admin.email)}
                              className="text-red-500 hover:text-red-700"
                              title="Remove Admin">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 py-2">No admins assigned to this reseller.</p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Customers</h3>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                {currentReseller.customers && currentReseller.customers.length > 0 ? (
                  <ul className="divide-y">
                    {currentReseller.customers.map(customer => (
                      <li key={customer.department_id} className="py-2">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.description || 'No description'}</p>
                        <p className="text-xs text-gray-400">Created: {new Date(customer.created_at).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 py-2">No customers assigned to this reseller.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Reseller Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Reseller</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAddReseller}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Name *</label>
                <input 
                  type="text" 
                  value={newReseller.name}
                  onChange={(e) => setNewReseller({...newReseller, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                <textarea 
                  value={newReseller.description}
                  onChange={(e) => setNewReseller({...newReseller, description: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Commission Rate (%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0" 
                  max="100"
                  value={newReseller.commission_rate}
                  onChange={(e) => setNewReseller({...newReseller, commission_rate: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={newReseller.is_active}
                    onChange={(e) => setNewReseller({...newReseller, is_active: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm font-medium">Active</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Reseller'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Reseller Admin</h2>
              <button onClick={() => setShowAddAdminModal(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Email *</label>
                <input 
                  type="email" 
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
                <input 
                  type="text" 
                  value={newAdmin.full_name}
                  onChange={(e) => setNewAdmin({...newAdmin, full_name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Password *</label>
                <input 
                  type="password" 
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only required if creating a new user. Leave blank if adding an existing user.
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
