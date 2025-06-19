import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '@/redux/slices/authSlice';
import ResellerDashboard from '@/components/resellerAdminDashboard/ResellerDashboard';

function ResellerAdminDashboardPage() {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
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

  // Protect this page for reseller admins only
  useEffect(() => {
    if (user && !user.is_reseller_admin && !loading) {
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

  return <ResellerDashboard />;
}

export default ResellerAdminDashboardPage;
