import React from 'react';
import { useSelector } from 'react-redux';
import { RiSettings3Line, RiNotification2Line, RiGlobalLine, RiBankCardLine, RiFileListLine } from 'react-icons/ri';

function ResellerSettings() {
  const { currentReseller } = useSelector(state => state.reseller);
  
  if (!currentReseller) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reseller Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
            General
          </button>
          <button className="px-6 py-3 text-gray-600 hover:text-gray-800">
            Notifications
          </button>
          <button className="px-6 py-3 text-gray-600 hover:text-gray-800">
            Branding
          </button>
          <button className="px-6 py-3 text-gray-600 hover:text-gray-800">
            Billing
          </button>
        </div>
        
        {/* General Settings */}
        <div className="p-6">
          <div className="max-w-2xl">
            {/* Reseller Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <RiSettings3Line className="mr-2" />
                Reseller Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Reseller Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue={currentReseller.name}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue={currentReseller.description}
                    rows="3"
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="status" 
                    className="h-4 w-4 text-blue-600 rounded"
                    defaultChecked={currentReseller.is_active} 
                  />
                  <label htmlFor="status" className="ml-2 text-gray-700">
                    Reseller is active
                  </label>
                </div>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="mb-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <RiNotification2Line className="mr-2" />
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">New Customer Notifications</p>
                    <p className="text-sm text-gray-500">Receive a notification when a new customer is added</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Subscription Alerts</p>
                    <p className="text-sm text-gray-500">Receive alerts about subscription changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Marketing Updates</p>
                    <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Branding Settings */}
            <div className="mb-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <RiGlobalLine className="mr-2" />
                Branding Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Custom Domain (Optional)
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="customers.yourcompany.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Customers will access their portal through this domain
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                      <span className="text-gray-400">Logo</span>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                      Upload New Logo
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="color" 
                      className="w-10 h-10 rounded cursor-pointer"
                      defaultValue="#3B82F6"
                    />
                    <input 
                      type="text" 
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue="#3B82F6"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Billing Settings */}
            <div className="mb-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <RiBankCardLine className="mr-2" />
                Commission Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Commission Rate (%)
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    defaultValue={currentReseller.commission_rate}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the percentage of revenue you earn from customer subscriptions
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Payment Method
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Stripe</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResellerSettings;
