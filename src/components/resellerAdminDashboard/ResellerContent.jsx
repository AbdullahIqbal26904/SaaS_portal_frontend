import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResellers, fetchResellerDetails } from '@/redux/slices/resellerSlice';

// Dashboard Components
import ResellerOverview from './ResellerOverview';
import ResellerCustomers from './ResellerCustomers';
import ResellerSubscriptions from './ResellerSubscriptions';
import ResellerAdmins from './ResellerAdmins';
import ResellerProfile from './ResellerProfile';
import ResellerSettings from './ResellerSettings';

function ResellerContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector(state => state.auth);
  const { currentReseller, loading: resellerLoading } = useSelector(state => state.reseller);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Extract the path segments
    const pathSegments = router.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Set active tab based on URL
    if (lastSegment === 'resellerAdminDashboard' || lastSegment === 'index') {
      setActiveTab('overview');
    } else if (lastSegment === 'customers') {
      setActiveTab('customers');
    } else if (lastSegment === 'subscriptions') {
      setActiveTab('subscriptions');
    } else if (lastSegment === 'admins') {
      setActiveTab('admins');
    } else if (lastSegment === 'profile') {
      setActiveTab('profile');
    } else if (lastSegment === 'settings') {
      setActiveTab('settings');
    }
    
    // Fetch reseller data if user is loaded
    if (user && user.is_reseller_admin) {
      dispatch(fetchResellers());
    }
    
  }, [router.pathname, user, dispatch]);
  
  // If no reseller is selected yet, select the first one from the list
  useEffect(() => {
    if (user?.is_reseller_admin && !currentReseller) {
      // Find the reseller ID associated with this admin
      const resellerId = user.reseller_id; // Assuming this field exists
      if (resellerId) {
        dispatch(fetchResellerDetails(resellerId));
      }
    }
  }, [user, currentReseller, dispatch]);
  
  // Loading state
  if (authLoading || resellerLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }
  
  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ResellerOverview />;
      case 'customers':
        return <ResellerCustomers />;
      case 'subscriptions':
        return <ResellerSubscriptions />;
      case 'admins':
        return <ResellerAdmins />;
      case 'profile':
        return <ResellerProfile />;
      case 'settings':
        return <ResellerSettings />;
      default:
        return <ResellerOverview />;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
}

export default ResellerContent;
