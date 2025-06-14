import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '@/redux/slices/urlslice';
import DashboardOverview from './DashboardOverview';
import DepartmentsDashboard from './DepartmentsDashboard';
import UsersDashboard from './UsersDashboard';
import ServicesDashboard from './ServicesDashboard';
import SubscriptionsDashboard from './SubscriptionsDashboard';
import ResellersDashboard from './ResellersDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import SettingsDashboard from './SettingsDashboard';

export default function AdminContent() {
  const { activeSection } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);
  
  // Determine which component to render based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'departments':
        return <DepartmentsDashboard />;
      case 'users':
        return <UsersDashboard />;
      case 'services':
        return <ServicesDashboard />;
      case 'subscriptions':
        return <SubscriptionsDashboard />;
      case 'resellers':
        return user && user.is_root_admin ? <ResellersDashboard /> : <DashboardOverview />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SettingsDashboard />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex-1 p-6 w-full">
      {renderContent()}
    </div>
  );
}
