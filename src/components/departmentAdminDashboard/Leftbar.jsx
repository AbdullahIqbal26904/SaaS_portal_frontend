import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FaHome, 
  FaUsers, 
  FaUserCog, 
  FaShieldAlt, 
  FaCreditCard, 
  FaCog, 
  FaPowerOff 
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

export default function Leftbar({ activePage }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { adminDepartments } = useSelector(state => state.department);
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="bg-white h-screen shadow-lg fixed top-0 left-0 w-64 z-10 overflow-y-auto">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Department Admin</h2>
        {adminDepartments && adminDepartments.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">{adminDepartments[0]?.name}</p>
        )}
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/departmentAdmindashboard" 
              className={`flex items-center p-2 rounded-md ${activePage === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaHome className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/departmentAdmindashboard/users" 
              className={`flex items-center p-2 rounded-md ${activePage === 'users' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaUsers className="mr-3" />
              <span>Users</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/departmentAdmindashboard/admins" 
              className={`flex items-center p-2 rounded-md ${activePage === 'admins' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaUserCog className="mr-3" />
              <span>Admins</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/departmentAdmindashboard/services" 
              className={`flex items-center p-2 rounded-md ${activePage === 'services' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaShieldAlt className="mr-3" />
              <span>Services</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/departmentAdmindashboard/subscriptions" 
              className={`flex items-center p-2 rounded-md ${activePage === 'subscriptions' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaCreditCard className="mr-3" />
              <span>Subscriptions</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/departmentAdmindashboard/settings" 
              className={`flex items-center p-2 rounded-md ${activePage === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaCog className="mr-3" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="flex items-center p-2 w-full text-left text-red-600 hover:bg-red-50 rounded-md"
        >
          <FaPowerOff className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
