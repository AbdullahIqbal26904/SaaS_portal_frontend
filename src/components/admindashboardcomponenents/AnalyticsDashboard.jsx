import React from 'react';

// Simple placeholder component for analytics
export default function AnalyticsDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex space-x-4">
          <select className="px-3 py-1 border rounded-md">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="px-4 py-1 bg-blue-600 text-white rounded-md">Export</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Subscription Growth</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">Subscription chart will be implemented in the next phase</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">User growth chart will be implemented in the next phase</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Popular Service Packages</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">Package popularity chart will be implemented in the next phase</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Department Activity</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">Department activity chart will be implemented in the next phase</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Revenue</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-gray-500">Revenue chart will be implemented in the next phase</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center space-x-3 p-3 border-l-4 border-blue-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <p className="font-medium">Action {item} description placeholder</p>
                <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
