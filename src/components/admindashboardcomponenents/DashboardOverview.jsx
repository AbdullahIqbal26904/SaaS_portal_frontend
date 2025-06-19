import React from 'react';
import { useSelector } from 'react-redux';

export default function DashboardOverview() {
  const { user } = useSelector(state => state.auth);

  const stats = [
    { title: 'Total Users', value: '24', change: '+12%', icon: '👥' },
    { title: 'Departments', value: '8', change: '+3', icon: '🏢' },
    { title: 'Active Subscriptions', value: '6', change: '+2', icon: '📋' },
    { title: 'Service Packages', value: '4', change: '0', icon: '📦' },
  ];

  const recentActivities = [
    { action: 'New user added', target: 'Marketing Department', time: '2 hours ago', icon: '➕' },
    { action: 'Subscription renewed', target: 'Basic Plan - HR Department', time: '5 hours ago', icon: '🔄' },
    { action: 'Service access granted', target: 'John Doe - CRM Service', time: '1 day ago', icon: '🔑' },
    { action: 'New department created', target: 'Business Development', time: '2 days ago', icon: '🏗️' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex space-x-4">
          <select className="px-3 py-1 border rounded-md">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="px-4 py-1 bg-blue-600 text-white rounded-md">Export</button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {user ? user.full_name : 'Administrator'}</h2>
        <p>Here's what's happening in your SaaS portal today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-green-500 text-sm mt-1">{stat.change}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="divide-y">
          {recentActivities.map((activity, index) => (
            <div key={index} className="py-3 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.target}</p>
              </div>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 text-blue-600 text-sm font-medium">View all activity →</button>
      </div>
    </div>
  );
}
