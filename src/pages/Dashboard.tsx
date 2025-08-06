import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useAuth } from '../hooks/useAuth';
import { useLodges } from '../hooks/useLodges';
import { selectCurrentModule, selectSidebarOpen, addNotification } from '../store/slices/uiSlice';
import { fetchBookings } from '../store/slices/bookingSlice';
import { fetchStaff } from '../store/slices/staffSlice';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import DashboardContent from '../components/dashboard/DashboardContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    user, 
    isLoading: authLoading, 
    assignedLodges, 
    hasGlobalAccess, 
    userRole 
  } = useAuth();
  const { loadLodges } = useLodges();
  const currentModule = useAppSelector(selectCurrentModule);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!user) {
        setIsInitializing(false);
        return;
      }

      try {
        setInitError(null);
        
        // Load lodges first
        const lodgesResult = await loadLodges();
        if (!lodgesResult.success) {
          throw new Error(lodgesResult.error || 'Failed to load lodges');
        }

        // Load initial data based on user permissions and lodge access
        const dataLoadPromises = [];

        // Load bookings (filtered by user's accessible lodges)
        if (user.permissions.includes('manage_bookings') || 
            user.permissions.includes('manage_bookings_assigned')) {
          dataLoadPromises.push(
            dispatch(fetchBookings({ 
              page: 1,
              filters: hasGlobalAccess ? {} : { lodgeIds: assignedLodges }
            }))
          );
        }

        // Load staff (filtered by user's accessible lodges)
        if (user.permissions.includes('manage_staff') || 
            user.permissions.includes('view_staff')) {
          dataLoadPromises.push(
            dispatch(fetchStaff({
              page: 1,
              userLodges: assignedLodges,
              userRole: userRole
            }))
          );
        }

        // Wait for all data to load
        await Promise.allSettled(dataLoadPromises);

        // Show welcome notification
        dispatch(addNotification({
          type: 'success',
          message: `Welcome back, ${user.name}! Dashboard loaded successfully.`
        }));

        setIsInitializing(false);
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize dashboard');
        setIsInitializing(false);
        
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to load dashboard data. Please refresh the page.'
        }));
      }
    };

    initializeDashboard();
  }, [user, dispatch, loadLodges, assignedLodges, hasGlobalAccess, userRole]);

  // Loading state
  if (authLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" color="blue" className="mx-auto mb-6" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {authLoading ? 'Authenticating...' : 'Loading Dashboard...'}
          </h3>
          <p className="text-gray-600">
            {authLoading 
              ? 'Please wait while we verify your credentials'
              : 'Setting up your personalized dashboard'
            }
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // No user (should not happen as auth is handled in App.tsx)
  if (!user) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content area */}
        <div className={`
          flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0
          ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
        `}>
          {/* Header */}
          <Header />
          
          {/* Main dashboard content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <ErrorBoundary>
                <DashboardContent module={currentModule} />
              </ErrorBoundary>
            </div>
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <span>&copy; 2025 Harris Lodges</span>
                <span>•</span>
                <span>Version 1.0.0</span>
                {!hasGlobalAccess && assignedLodges.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600">
                      Access: {assignedLodges.length} lodge{assignedLodges.length !== 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</span>
                <span>•</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;