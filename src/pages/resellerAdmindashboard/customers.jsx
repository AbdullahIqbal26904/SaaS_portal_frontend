import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ResellerDashboard from '@/components/resellerAdminDashboard/ResellerDashboard';

function CustomersPage() {
  const { user, loading } = useSelector(state => state.auth);
  const router = useRouter();

  // Protect this page for reseller admins only
  useEffect(() => {
    if (!loading && user && !user.is_reseller_admin) {
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

export default CustomersPage;
