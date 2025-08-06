import React, { useEffect, useState, Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAuth } from './hooks/useAuth';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { loadUserFromStorage } from './store/slices/authSlice';
import { selectUser, selectIsAuthenticated, selectAuthLoading } from './store/slices/authSlice';
import { addNotification, selectNotifications } from './store/slices/uiSlice';
import AuthErrorBoundary from './components/auth/AuthErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import NotificationToast from './components/ui/NotificationToast';
import './App.css';

// Lazy load main components for better performance
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// App version and build info
const APP_VERSION = '1.0.0';
const BUILD_DATE = new Date().toISOString().split('T')[0];

// Network status hook
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Main app content component
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const notifications = useAppSelector(selectNotifications);
  const isOnline = useNetworkStatus();
  
  const [appInitialized, setAppInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize app and load user data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setInitError(null);
        
        // Load user from storage if exists using Redux dispatch
        await dispatch(loadUserFromStorage());
        
        // Add any other app initialization logic here
        // e.g., load app settings, check for updates, etc.
        
        setAppInitialized(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize application');
        setAppInitialized(true); // Still allow app to load
      }
    };

    initializeApp();
  }, [dispatch]);

  // Network status notifications
  useEffect(() => {
    if (!isOnline && appInitialized) {
      dispatch(addNotification({
        type: 'warning',
        message: 'You are currently offline. Some features may not be available.'
      }));
    }
  }, [isOnline, dispatch, appInitialized]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Only handle shortcuts if user is authenticated
      if (!user) return;

      // Ctrl/Cmd + K for quick search (future feature)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Future: Open search modal
        console.log('Quick search shortcut triggered');
      }

      // Ctrl/Cmd + Shift + L for logout
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        // Future: Confirm logout
        console.log('Quick logout shortcut triggered');
      }

      // Escape key to close modals/dropdowns (future feature)
      if (event.key === 'Escape') {
        // Future: Close any open modals
        console.log('Escape key pressed');
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [user]);

  // App loading state
  if (!appInitialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-90 rounded-full mb-4 shadow-lg">
              <svg 
                className="w-12 h-12 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
            </div>
          </div>
          
          <LoadingSpinner size="lg" color="blue" className="mx-auto mb-6" />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Harris Lodges</h2>
          <p className="text-gray-600 mb-4">
            {authLoading ? 'Authenticating...' : 'Loading application...'}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>Version {APP_VERSION}</span>
            <span>•</span>
            <span>{BUILD_DATE}</span>
          </div>
          
          {initError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{initError}</p>
            </div>
          )}
          
          {!isOnline && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⚠️ You are currently offline
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // App initialization error (non-blocking)
  if (initError && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Error</h3>
          <p className="text-gray-600 mb-6">{initError}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Application
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Data & Reload
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              If this problem persists, please contact your system administrator
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Error ID: {Date.now().toString(36)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main app render
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" color="blue" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading Harris Lodges...</p>
        </div>
      </div>
    }>
      <div className="app-container">
        {/* Offline indicator */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-center py-2 text-sm font-medium z-50">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>You are offline. Some features may not work properly.</span>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className={!isOnline ? 'pt-10' : ''}>
          {isAuthenticated && user ? (
            <Dashboard />
          ) : (
            <AuthPage />
          )}
        </div>
        
        {/* Global notifications */}
        <NotificationToast />
        
        {/* Development info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-40">
            <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span>ENV: {process.env.NODE_ENV}</span>
                </div>
                <div>Version: {APP_VERSION}</div>
                <div>Build: {BUILD_DATE}</div>
                {user && (
                  <>
                    <div>User: {user.name} ({user.role})</div>
                    <div>ID: {user.employeeId || 'N/A'}</div>
                    <div>
                      Lodges: {user.assignedLodges.length === 0 ? 'All' : user.assignedLodges.length}
                    </div>
                    <div>Auth: ✅</div>
                  </>
                )}
                {!user && <div>Auth: ❌</div>}
              </div>
            </div>
          </div>
        )}
        
        {/* Performance monitoring (development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-40">
            <div className="bg-blue-800 text-white px-3 py-2 rounded-lg text-xs">
              <div>Notifications: {notifications.length}</div>
              <div>Memory: {(performance as any).memory ? 
                `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 
                'N/A'
              }</div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

// Error boundary wrapper for the entire app
const AppWithErrorBoundary: React.FC = () => {
  return (
    <AuthErrorBoundary>
      <AppContent />
    </AuthErrorBoundary>
  );
};

// Main App component with Redux Provider
const App: React.FC = () => {
  // Global error handler
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // You can add error reporting service here
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      // You can add error reporting service here
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <Provider store={store}>
      <AppWithErrorBoundary />
    </Provider>
  );
};

export default App;