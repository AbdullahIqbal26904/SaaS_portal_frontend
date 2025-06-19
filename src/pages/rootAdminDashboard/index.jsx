import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Leftbar from '@/components/admindashboardcomponenents/Leftbar';
import Topbar from '@/components/admindashboardcomponenents/Topbar';
import AdminContent from '@/components/admindashboardcomponenents/AdminContent';
import { fetchUserProfile } from '@/redux/slices/authSlice';

function RootAdminDashboard() {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  const { openleftbar } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Import at the top level is best, but for minimal changes we're doing it here
    const { isAuthenticated } = require('@/utils/tokenPersistence');
    
    // Check if user is authenticated and fetch profile if needed
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, router]);

  // Protect this page for root admins only
  useEffect(() => {
    if (user && !user.is_root_admin && !loading) {
      router.push('/home-page');
    }
  }, [user, router, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Leftbar />
      <div className={`flex-1 flex flex-col ${openleftbar ? 'ml-[16.666667%]' : 'ml-16'}`}>
        <Topbar />
        <div className="flex-1 overflow-y-auto pt-16">
          <AdminContent />
        </div>
      </div>
    </div>
  );
}

export default RootAdminDashboard;
