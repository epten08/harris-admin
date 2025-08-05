import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useAuth } from '../hooks/useAuth';
import { selectCurrentModule, selectSidebarOpen } from '../store/slices/uiSlice';
import { loadUserFromStorage } from '../store/slices/authSlice';
import { fetchBookings } from '../store/slices/bookingSlice';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import DashboardContent from '../components/dashboard/DashboardContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAuth();
  const currentModule = useAppSelector(selectCurrentModule);
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  useEffect(() => {
    // Load user data and initial dashboard data
    if (!user) {
      dispatch(loadUserFromStorage());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Load initial dashboard data
    if (user) {
      dispatch(fetchBookings({ page: 1 }));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" color="blue" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This should not happen as auth is handled in App.tsx
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className={`
        flex-1 flex flex-col transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
      `}>
        {/* Header */}
        <Header />
        
        {/* Main dashboard content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <DashboardContent module={currentModule} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;