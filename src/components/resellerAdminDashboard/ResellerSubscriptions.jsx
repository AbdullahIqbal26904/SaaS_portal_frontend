import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResellerCustomers, createResellerSubscription } from '@/redux/slices/resellerSlice';
import { RiAddLine, RiSearchLine, RiFilterLine } from 'react-icons/ri';

function ResellerSubscriptions() {
  const dispatch = useDispatch();
  const { currentReseller, resellerCustomers, loading, error, success } = useSelector(state => state.reseller);
  const { servicePackages } = useSelector(state => state.service);
  
  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, expired
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSubscription, setNewSubscription] = useState({
    department: '',
    service_package: ''
  });
  
  // Load customers when component mounts or reseller changes
  useEffect(() => {
    if (currentReseller) {
      dispatch(fetchResellerCustomers(currentReseller.reseller_id));
      
      // For demo purposes, we'll create some sample subscriptions
      // In a real app, these would come from an API call
      const sampleSubscriptions = [
        {
          id: 1,
          department: {
            id: 4,
            name: 'Customer Corp',
            description: 'Enterprise customer'
          },
          service_package: {
            id: 2,
            name: 'Premium Package',
            price: '199.99',
            billing_cycle: 'monthly'
          },
          start_date: '2025-05-15',
          end_date: '2025-06-15',
          status: 'active'
        },
        {
          id: 2,
          department: {
            id: 5,
            name: 'Startup Ltd',
            description: 'Small business customer'
          },
          service_package: {
            id: 1,
            name: 'Basic Package',
            price: '99.99',
            billing_cycle: 'monthly'
          },
          start_date: '2025-04-10',
          end_date: '2025-07-10',
          status: 'active'
        }
      ];
      
      setSubscriptions(sampleSubscriptions);
    }
  }, [currentReseller, dispatch]);
  
  // Reset form after successful subscription creation
  useEffect(() => {
    if (success && showAddModal) {
      setShowAddModal(false);
      setNewSubscription({ department: '', service_package: '' });
    }
  }, [success]);
  
  // Handle create new subscription
  const handleCreateSubscription = (e) => {
    e.preventDefault();
    if (currentReseller) {
      dispatch(createResellerSubscription({
        resellerId: currentReseller.reseller_id,
        subscriptionData: newSubscription
      }));
    }
  };
  
  // Get customers for dropdown
  const getCustomers = () => {
    if (!currentReseller || !resellerCustomers[currentReseller.reseller_id]) {
      return [];
    }
    return resellerCustomers[currentReseller.reseller_id].map(customer => ({
      id: customer.department,
      name: customer.department_details?.name || 'Unnamed Customer'
    }));
  };
  
  // Get service packages for dropdown (in a real app, these would come from redux)
  const getServicePackages = () => {
    // For demo purposes
    return [
      { id: 1, name: 'Basic Package - $99.99/month' },
      { id: 2, name: 'Premium Package - $199.99/month' },
      { id: 3, name: 'Enterprise Package - $499.99/month' }
    ];
  };
  
  // Filter subscriptions
  const getFilteredSubscriptions = () => {
    let filtered = [...subscriptions];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.service_package.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(sub => sub.status === filter);
    }
    
    return filtered;
  };
  
  const filteredSubscriptions = getFilteredSubscriptions();
  const customers = getCustomers();
  const packages = getServicePackages();
  
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
          <p className="text-gray-600">
            Manage customer subscriptions for your reseller account
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <RiAddLine className="mr-2" />
          Add New Subscription
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search subscriptions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <RiSearchLine className="absolute left-3 top-3 text-gray-500" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Status:</span>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Subscription List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading subscriptions...</p>
          </div>
        ) : filteredSubscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {subscription.department.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subscription.service_package.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${subscription.service_package.price}/{subscription.service_package.billing_cycle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscription.status === 'active' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                      {subscription.status === 'expired' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Expired
                        </span>
                      )}
                      {subscription.status === 'cancelled' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscription.start_date).toLocaleDateString()} - {new Date(subscription.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Renew
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No subscriptions found</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Subscription
            </button>
          </div>
        )}
      </div>
      
      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Subscription</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
              </div>
            )}
            
            <form onSubmit={handleCreateSubscription}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Customer *
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSubscription.department}
                  onChange={(e) => setNewSubscription({...newSubscription, department: e.target.value})}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Service Package *
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSubscription.service_package}
                  onChange={(e) => setNewSubscription({...newSubscription, service_package: e.target.value})}
                  required
                >
                  <option value="">Select Package</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
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
                  {loading ? 'Creating...' : 'Create Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResellerSubscriptions;
