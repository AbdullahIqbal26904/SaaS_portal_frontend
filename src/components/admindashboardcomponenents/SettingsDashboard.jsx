import React from 'react';
import { useSelector } from 'react-redux';
import { FaLock, FaEnvelope, FaBell, FaGlobe, FaShieldAlt, FaDatabase } from 'react-icons/fa';

export default function SettingsDashboard() {
  const { user } = useSelector(state => state.auth);

  const settingsSections = [
    { 
      title: 'Account Settings', 
      icon: <FaLock className="text-blue-600 text-xl" />,
      items: [
        { label: 'Profile Information', description: 'Update your account details and personal information' },
        { label: 'Password', description: 'Manage your password' },
        { label: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account' }
      ]
    },
    { 
      title: 'Notification Preferences', 
      icon: <FaBell className="text-blue-600 text-xl" />,
      items: [
        { label: 'Email Notifications', description: 'Configure when you receive emails about activities and events' },
        { label: 'System Notifications', description: 'Set preferences for system alerts and notices' }
      ]
    },
    { 
      title: 'System Settings', 
      icon: <FaGlobe className="text-blue-600 text-xl" />,
      items: [
        { label: 'Regional Settings', description: 'Language, timezone, and date format preferences' },
        { label: 'API Access', description: 'Manage API keys and access tokens' }
      ]
    },
  ];

  // Only show advanced settings to root admin
  if (user && user.is_root_admin) {
    settingsSections.push({
      title: 'Advanced Settings',
      icon: <FaShieldAlt className="text-blue-600 text-xl" />,
      items: [
        { label: 'Security Policies', description: 'Set password requirements and session timeouts' },
        { label: 'Database Maintenance', description: 'Schedule backups and performance optimizations' },
        { label: 'System Log', description: 'View system activity and error logs' }
      ]
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {settingsSections.map((section, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              {section.icon}
              <h2 className="text-xl font-semibold ml-2">{section.title}</h2>
            </div>
            <ul className="space-y-4">
              {section.items.map((item, idx) => (
                <li key={idx} className="border-b border-gray-100 pb-3">
                  <a href="#" className="block hover:bg-gray-50 p-2 rounded">
                    <div className="font-medium text-blue-700">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
        <div className="flex items-center mb-4">
          <FaDatabase className="text-blue-600 text-xl" />
          <h2 className="text-xl font-semibold ml-2">System Information</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Version</div>
              <div className="font-medium">SaaS Portal v1.0.0</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-medium">June 14, 2025</div>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Server Status</div>
              <div className="font-medium text-green-600">Operational</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-500">Support</div>
              <div className="font-medium">
                <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
