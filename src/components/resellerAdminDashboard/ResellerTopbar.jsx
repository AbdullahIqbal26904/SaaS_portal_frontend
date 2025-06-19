import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RiMenuLine, RiMenuFoldLine, RiNotification3Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { FiSearch } from 'react-icons/fi';
import { logout } from '@/redux/slices/authSlice';

// This assumes you have these actions in your urlslice
// If not, you'll need to add them
// We're assuming toggleLeftbar action exists in urlslice to match the root admin dashboard
// You'll need to check this

function ResellerTopbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { openleftbar } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);

  const toggleSidebar = () => {
    // This action needs to be defined in your urlslice.js
    dispatch({ type: 'ui/toggleLeftbar' });
  };

  const handleSignOut = () => {
    // Use the Redux logout action instead of directly accessing localStorage
    dispatch(logout());
    
    // Redirect to home page
    router.push('/');
  };

  return (
    <header className="fixed top-0 right-0 w-full h-16 bg-white shadow-sm z-10 flex items-center justify-between px-4">
      <div className="flex items-center">
        {/* Toggle Button */}
        <button 
          className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
          onClick={toggleSidebar}
        >
          {openleftbar ? <RiMenuFoldLine size={20} /> : <RiMenuLine size={20} />}
        </button>
        
        {/* Title based on current page */}
        <h1 className="ml-4 text-lg font-medium text-gray-800">
          Reseller Dashboard
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>
        
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700 relative">
          <RiNotification3Line size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User Menu */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
          </div>
          <div className="mr-4 hidden md:block">
            <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
            <p className="text-xs text-gray-500">Reseller Admin</p>
          </div>
          
          {/* Logout button */}
          <button 
            onClick={handleSignOut}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            title="Sign out"
          >
            <RiLogoutBoxRLine size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default ResellerTopbar;
