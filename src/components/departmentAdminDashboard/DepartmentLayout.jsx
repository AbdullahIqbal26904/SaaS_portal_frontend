import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Leftbar from './Leftbar';
import Topbar from './Topbar';
import { fetchAdminDepartments } from '@/redux/slices/departmentSlice';
import LoadingToTick from '../Loader/LoadingToTick';

export default function DepartmentLayout({ children, activePage }) {
  const dispatch = useDispatch();
  const { loading, adminDepartments, error } = useSelector(state => state.department);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAdminDepartments());
    }
  }, [dispatch, isAuthenticated]);
  
  if (loading) {
    return <LoadingToTick />;
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error.detail || 'An error occurred. Please try again.'}</p>
          <button 
            onClick={() => dispatch(fetchAdminDepartments())}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Check if user has any departments they administer
  if (adminDepartments?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">No Access</h2>
          <p className="text-gray-700">You are not an admin for any departments.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <Leftbar activePage={activePage} />
      
      {/* Main Content Area */}
      <div className="ml-64">
        {/* Top Bar */}
        <Topbar />
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
