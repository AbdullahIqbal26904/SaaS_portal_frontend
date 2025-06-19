import React from 'react';
import { FaBell, FaEnvelope, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Topbar() {
  const { user } = useSelector(state => state.auth);
  
  return (
    <div className="bg-white border-b border-gray-200 flex items-center justify-between h-16 px-6">
      <div className="flex-1">
        {/* Empty space or breadcrumbs could go here */}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100">
          <FaBell />
        </button>
        
        {/* Messages Icon */}
        <button className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100">
          <FaEnvelope />
        </button>
        
        {/* User Profile */}
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
            <FaUser />
          </div>
          <span className="ml-2 font-medium">{user?.full_name || 'User'}</span>
        </div>
      </div>
    </div>
  );
}
