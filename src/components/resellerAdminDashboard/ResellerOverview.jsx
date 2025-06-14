import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResellerCustomers } from '@/redux/slices/resellerSlice';
import { RiUserAddLine, RiBuilding2Line, RiTeamLine, RiBarChartBoxLine } from 'react-icons/ri';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';

function ResellerOverview() {
  const dispatch = useDispatch();
  const { currentReseller, resellerCustomers, loading } = useSelector(state => state.reseller);
  
  useEffect(() => {
    if (currentReseller) {
      dispatch(fetchResellerCustomers(currentReseller.reseller_id));
    }
  }, [currentReseller, dispatch]);
  
  // If no reseller data yet
  if (!currentReseller) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">No reseller data available.</p>
      </div>
    );
  }
  
  // Get customers count
  const customerCount = resellerCustomers[currentReseller.reseller_id]?.length || 0;
  
  // Stats cards data
  const statsCards = [
    { 
      title: 'Total Customers', 
      value: customerCount, 
      icon: <RiTeamLine className="text-blue-500 text-3xl" />,
      bgColor: 'bg-blue-50' 
    },
    { 
      title: 'Active Subscriptions', 
      value: currentReseller.active_subscriptions || 0, 
      icon: <FiPackage className="text-green-500 text-3xl" />,
      bgColor: 'bg-green-50' 
    },
    { 
      title: 'Commission Rate', 
      value: `${currentReseller.commission_rate}%`, 
      icon: <FiShoppingBag className="text-purple-500 text-3xl" />,
      bgColor: 'bg-purple-50' 
    },
    { 
      title: 'Monthly Revenue', 
      value: currentReseller.monthly_revenue ? `$${currentReseller.monthly_revenue}` : '$0',
      icon: <RiBarChartBoxLine className="text-amber-500 text-3xl" />,
      bgColor: 'bg-amber-50' 
    }
  ];
  
  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to {currentReseller.name}'s Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor and manage your customers, subscriptions, and revenue.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className={`p-6 rounded-lg shadow-sm border ${card.bgColor}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
              </div>
              <div className="p-3 rounded-full bg-white">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center">
            <RiUserAddLine className="text-blue-500 text-xl mr-3" />
            <span>Add New Customer</span>
          </button>
          <button className="p-4 border border-green-100 rounded-lg bg-green-50 hover:bg-green-100 flex items-center">
            <FiPackage className="text-green-500 text-xl mr-3" />
            <span>Create Subscription</span>
          </button>
          <button className="p-4 border border-purple-100 rounded-lg bg-purple-50 hover:bg-purple-100 flex items-center">
            <RiBuilding2Line className="text-purple-500 text-xl mr-3" />
            <span>View Reseller Details</span>
          </button>
        </div>
      </div>
      
      {/* Recent Customers */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Customers</h2>
        
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading customers...</p>
          </div>
        ) : resellerCustomers[currentReseller.reseller_id]?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resellerCustomers[currentReseller.reseller_id].slice(0, 5).map((customer) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No customers found. Add your first customer!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResellerOverview;
