import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import DepartmentLayout from '@/components/departmentAdminDashboard/DepartmentLayout';
import DashboardOverview from '@/components/departmentAdminDashboard/DashboardOverview';
import LoadingToTick from '@/components/Loader/LoadingToTick';

export default function DepartmentAdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  const { adminDepartments } = useSelector(state => state.department);
  
  // Check if user is authenticated and is department admin
  useEffect(() => {
    // If auth is loaded and user is not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push('/');
      return;
    }
    
    // If user is authenticated but has no admin departments, redirect
    if (isAuthenticated && user && adminDepartments && adminDepartments.length === 0) {
      router.push('/');
    }
  }, [isAuthenticated, user, adminDepartments, loading, router]);
  
  if (loading || !isAuthenticated) {
    return <LoadingToTick />;
  }
  
  return (
    <DepartmentLayout activePage="dashboard">
      <DashboardOverview />
    </DepartmentLayout>
  );
}
