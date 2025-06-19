import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResellerCustomers, createResellerCustomer } from '@/redux/slices/resellerSlice';
import { RiUserAddLine, RiSearchLine, RiFilterLine, RiArrowUpDownLine } from 'react-icons/ri';
function ResellerCustomers() {
  const dispatch = useDispatch();
  const { currentReseller, resellerCustomers, loading, error, success } = useSelector(state => state.reseller);
  
  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, status, date
  const [sortDirection, setSortDirection] = useState('asc'); // asc, desc
  const [dataFetched, setDataFetched] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    description: ''
  });
  
  // Load customers when component mounts or reseller changes
  useEffect(() => {
    if (currentReseller && currentReseller.reseller_id && !dataFetched) {
      // Only fetch if we have a valid reseller ID
      console.log("Fetching customers for reseller:", currentReseller.reseller_id);
      dispatch(fetchResellerCustomers(currentReseller.reseller_id));
      setDataFetched(true);
    }
  }, [currentReseller, dispatch, dataFetched]);
  
  // Reset form after successful customer creation
  useEffect(() => {
    if (success && showAddModal) {
      setShowAddModal(false);
      setNewCustomer({ name: '', description: '' });
      
      // Refresh the customer list after adding a new one
      if (currentReseller && currentReseller.reseller_id) {
        dispatch(fetchResellerCustomers(currentReseller.reseller_id));
      }
    }
  }, [success, currentReseller, dispatch, showAddModal]);
  
  // Handle create new customer
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (currentReseller && currentReseller.reseller_id) {
      dispatch(createResellerCustomer({
        resellerId: currentReseller.reseller_id,
        customerData: newCustomer
      }));
    }
  };
  
  // Toggle sort direction or change sort field
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort customers
  const getFilteredAndSortedCustomers = () => {
    // Check if we have both a reseller and customers for that reseller
    if (!currentReseller || 
        !currentReseller.reseller_id || 
        !resellerCustomers || 
        !resellerCustomers[currentReseller.reseller_id]) {
      return [];
    }
    
    let filtered = [...resellerCustomers[currentReseller.reseller_id]];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.department_details?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.department_details?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting (safely handle missing properties)
    filtered.sort((a, b) => {
      let compareA, compareB;
      
      switch (sortBy) {
        case 'name':
          compareA = (a.department_details?.name || '').toLowerCase();
          compareB = (b.department_details?.name || '').toLowerCase();
          break;
        case 'status':
          compareA = a.is_active ? 1 : 0;
          compareB = b.is_active ? 1 : 0;
          break;
        case 'date':
          // Use current time as fallback if date is missing
          compareA = a.created_at ? new Date(a.created_at).getTime() : Date.now();
          compareB = b.created_at ? new Date(b.created_at).getTime() : Date.now();
          break;
        default:
          compareA = (a.department_details?.name || '').toLowerCase();
          compareB = (b.department_details?.name || '').toLowerCase();
      }
      
      // Sort direction (handle when values are equal)
      if (compareA === compareB) return 0;
      return sortDirection === 'asc' 
        ? (compareA < compareB ? -1 : 1)
        : (compareA > compareB ? -1 : 1);
    });
    
    return filtered;
  };
  
  // Get the filtered customers
  const filteredCustomers = getFilteredAndSortedCustomers();
  
  // Show a more detailed error state
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h1 className="text-xl font-bold text-red-700 mb-2">Error Loading Customers</h1>
        <p className="text-red-600">{typeof error === 'string' ? error : 'Failed to load customer data. Please refresh the page or try again later.'}</p>
        <button 
          onClick={() => {
            if (currentReseller && currentReseller.reseller_id) {
              setDataFetched(false);
              dispatch(fetchResellerCustomers(currentReseller.reseller_id));
            }
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // If reseller data is missing
  if (!currentReseller || !currentReseller.reseller_id) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">No reseller data available. Please select a reseller first.</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600">
            Manage your reseller customers
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <RiUserAddLine className="mr-2" />
          Add New Customer
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <RiSearchLine className="absolute left-3 top-3 text-gray-500" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort by:</span>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="date">Creation Date</option>
            </select>
            <button 
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <RiArrowUpDownLine className={sortDirection === 'asc' ? 'text-gray-600' : 'text-gray-600 transform rotate-180'} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Customer List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading customers...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center"
                    >
                      Name
                      {sortBy === 'name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center"
                    >
                      Status
                      {sortBy === 'status' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('date')}
                      className="flex items-center"
                    >
                      Created
                      {sortBy === 'date' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscriptions
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {customer.department_details?.name || 'Unnamed Customer'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.department_details?.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.is_active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.subscription_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No customers found</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Customer
            </button>
          </div>
        )}
      </div>
      
      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
              </div>
            )}
            
            <form onSubmit={handleCreateCustomer}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Customer Name *
                </label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer description"
                  value={newCustomer.description}
                  onChange={(e) => setNewCustomer({...newCustomer, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResellerCustomers;
