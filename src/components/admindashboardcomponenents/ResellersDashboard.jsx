import React from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Placeholder component for resellers dashboard
// This will be implemented in later phases according to the requirements
export default function ResellersDashboard() {
  // Mock data for resellers
  const mockResellers = [
    { 
      id: 1, 
      name: 'Tech Solutions Inc.', 
      email: 'admin@techsolutions.com', 
      customerCount: 12, 
      status: 'active',
      joinDate: '2025-01-15'
    },
    { 
      id: 2, 
      name: 'Business Partners Ltd', 
      email: 'partner@bizpartners.com', 
      customerCount: 8, 
      status: 'active',
      joinDate: '2025-02-20'
    },
    { 
      id: 3, 
      name: 'Digital Services Co.', 
      email: 'info@digitalservices.com', 
      customerCount: 5, 
      status: 'inactive',
      joinDate: '2025-03-10'
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resellers & Partners</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center">
          <FaPlus className="mr-2" /> Add Reseller
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <input 
                type="text" 
                placeholder="Search resellers..." 
                className="px-4 py-2 border rounded-md w-64"
              />
            </div>
            <div>
              <select className="px-4 py-2 border rounded-md mr-2">
                <option value="">Status: All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select className="px-4 py-2 border rounded-md">
                <option value="">Sort By: Newest</option>
                <option value="name">Name</option>
                <option value="customers">Customer Count</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Reseller</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Customers</th>
                  <th className="py-3 px-6 text-left">Join Date</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {mockResellers.map(reseller => (
                  <tr key={reseller.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="font-medium">{reseller.name}</div>
                    </td>
                    <td className="py-3 px-6 text-left">{reseller.email}</td>
                    <td className="py-3 px-6 text-left">{reseller.customerCount}</td>
                    <td className="py-3 px-6 text-left">{reseller.joinDate}</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reseller.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {reseller.status.charAt(0).toUpperCase() + reseller.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">Showing 1-3 of 3 resellers</div>
            <div className="flex">
              <button className="px-3 py-1 border rounded-l-md bg-gray-100">&lt;</button>
              <button className="px-3 py-1 border-t border-b bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 border rounded-r-md bg-gray-100">&gt;</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-500">Note: Complete reseller management functionality will be implemented in a future phase.</p>
      </div>
    </div>
  );
}
