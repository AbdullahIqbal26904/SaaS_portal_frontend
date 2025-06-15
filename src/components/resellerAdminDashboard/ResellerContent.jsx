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
  const { resellers, currentReseller, loading: resellerLoading } = useSelector(state => state.reseller);
  
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
    
    // Fetch all resellers when the component mounts or when user changes
    if (user && user.is_reseller_admin) {
      dispatch(fetchResellers());
    }
  }, [router.pathname, user, dispatch]);
  
  // If no reseller is selected yet, find the appropriate reseller for this admin
  useEffect(() => {
    if (user?.is_reseller_admin && !currentReseller && resellers && resellers.length > 0) {
      // Find the reseller that this admin belongs to
      // First check if there's a direct reseller_id in the user object
      if (user.reseller_id) {
        dispatch(fetchResellerDetails(user.reseller_id));
      } else {
        // If not, look through resellers to find one where this user is an admin
        const userEmail = user.email;
        const userReseller = resellers.find(reseller => 
          reseller.admins && 
          reseller.admins.some(admin => admin.email === userEmail)
        );
        
        if (userReseller) {
          dispatch(fetchResellerDetails(userReseller.reseller_id));
        } else if (resellers.length === 1) {
          // If there's only one reseller, select it
          dispatch(fetchResellerDetails(resellers[0].reseller_id));
        }
      }
    }
  }, [user, currentReseller, resellers, dispatch]);
  
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
