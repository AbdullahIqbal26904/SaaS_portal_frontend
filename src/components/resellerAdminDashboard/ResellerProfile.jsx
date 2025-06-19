import React from 'react';
import { useSelector } from 'react-redux';
import { RiUserLine, RiMailLine, RiPhoneLine, RiShieldUserLine, RiCalendarLine } from 'react-icons/ri';

function ResellerProfile() {
  const { user } = useSelector(state => state.auth);
  const { currentReseller } = useSelector(state => state.reseller);
  
  if (!user || !currentReseller) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.full_name}</h2>
              <p className="text-gray-600">Reseller Admin</p>
              <div className="mt-4 w-full border-t pt-4">
                <div className="flex items-center my-2">
                  <RiMailLine className="text-gray-500 mr-2" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center my-2">
                  <RiShieldUserLine className="text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    {user.is_reseller_admin ? 'Reseller Administrator' : 'Standard User'}
                  </span>
                </div>
                <div className="flex items-center my-2">
                  <RiCalendarLine className="text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-6 w-full">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2">
                  Edit Profile
                </button>
                <button className="w-full mt-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg py-2">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reseller Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reseller Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Reseller Name</p>
                <p className="font-medium text-gray-800">{currentReseller.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Commission Rate</p>
                <p className="font-medium text-gray-800">{currentReseller.commission_rate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${currentReseller.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {currentReseller.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium text-gray-800">
                  {new Date(currentReseller.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-800">{currentReseller.description}</p>
            </div>
          </div>
          
          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-red-600 mr-2">Disabled</span>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                    Enable
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">API Access</p>
                    <p className="text-sm text-gray-500">Manage API keys for integrations</p>
                  </div>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                    Manage Keys
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Login History</p>
                    <p className="text-sm text-gray-500">View your recent login activity</p>
                  </div>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResellerProfile;
