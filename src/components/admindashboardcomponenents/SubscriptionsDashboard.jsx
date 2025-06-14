import React from 'react';

// Placeholder component for subscriptions dashboard
export default function SubscriptionsDashboard() {
  // Mock data for subscriptions
  const mockSubscriptions = [
    {
      id: 1,
      department: 'Marketing',
      servicePackage: 'Premium Plan',
      status: 'active',
      startDate: '2025-05-01',
      endDate: '2025-06-30',
      price: 99.99,
    },
    {
      id: 2,
      department: 'HR',
      servicePackage: 'Basic Plan',
      status: 'active',
      startDate: '2025-05-15',
      endDate: '2025-06-15',
      price: 29.99,
    },
    {
      id: 3,
      department: 'Engineering',
      servicePackage: 'Premium Plan',
      status: 'active',
      startDate: '2025-04-01',
      endDate: '2025-07-01',
      price: 99.99,
    },
    {
      id: 4,
      department: 'Sales',
      servicePackage: 'Standard Plan',
      status: 'expired',
      startDate: '2025-03-01',
      endDate: '2025-06-01',
      price: 59.99,
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          New Subscription
        </button>
      </div>

      <div className="flex mb-6 space-x-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search subscriptions..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
        <select className="p-2 border border-gray-300 rounded-md">
          <option value="">All Departments</option>
          <option value="marketing">Marketing</option>
          <option value="hr">HR</option>
          <option value="engineering">Engineering</option>
        </select>
        <select className="p-2 border border-gray-300 rounded-md">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockSubscriptions.map(subscription => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscription.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subscription.servicePackage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                      subscription.status === 'expired' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${subscription.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      {subscription.status === 'active' && (
                        <button className="text-green-600 hover:text-green-900">Renew</button>
                      )}
                      {subscription.status === 'expired' && (
                        <button className="text-blue-600 hover:text-blue-900">Reactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">4</span> subscriptions
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
