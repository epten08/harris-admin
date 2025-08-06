import React, { Suspense } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../auth/ProtectedRoute';
import LoadingSpinner from '../ui/LoadingSpinner';
import DashboardSkeleton from './DashboardSkeleton';

// Lazy load dashboard components for better performance
const AdminDashboard = React.lazy(() => import('./AdminDashboard'));
const ManagerDashboard = React.lazy(() => import('./ManagerDashboard'));
const SupervisorDashboard = React.lazy(() => import('./SupervisorDashboard'));
const ReceptionistDashboard = React.lazy(() => import('./ReceptionistDashboard'));
const CleanerDashboard = React.lazy(() => import('./CleanerDashboard'));
const MaintenanceDashboard = React.lazy(() => import('./MaintenanceDashboard'));

// Lazy load modules
const LodgesModule = React.lazy(() => import('./modules/LodgesModule'));
const BookingsModule = React.lazy(() => import('./modules/BookingModule'));
const CustomersModule = React.lazy(() => import('./modules/CustomerModule'));
const StaffModule = React.lazy(() => import('./modules/StaffModule'));
const InvoicesModule = React.lazy(() => import('./modules/InvoiceModule'));
const PaymentsModule = React.lazy(() => import('./modules/PaymentsModule'));
const ReportsModule = React.lazy(() => import('./modules/ReportsModule'));
const SettingsModule = React.lazy(() => import('./modules/SettingsModule'));

interface DashboardContentProps {
  module: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ module }) => {
  const { user, hasGlobalAccess } = useAuth();

  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" color="blue" />
    </div>
  );

  const getDashboardByRole = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'cleaner':
        return <CleanerDashboard />;
      case 'maintenance':
        return <MaintenanceDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderModule = () => {
    switch (module) {
      case 'dashboard':
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            {getDashboardByRole()}
          </Suspense>
        );
      
      case 'lodges':
        return (
          <ProtectedRoute 
            requiredPermission="manage_lodges"
            requiredRole={['admin', 'manager', 'supervisor']}
          >
            <Suspense fallback={<LoadingFallback />}>
              <LodgesModule />
            </Suspense>
          </ProtectedRoute>
        );
      
      case 'bookings':
        return (
          <ProtectedRoute 
            requiredPermission="manage_bookings"
            requiredRole={['admin', 'manager', 'supervisor', 'receptionist']}
          >
            <Suspense fallback={<LoadingFallback />}>
              <BookingsModule />
            </Suspense>
          </ProtectedRoute>
        );
      
      case 'customers':
        return (
          <ProtectedRoute 
            requiredPermission="manage_customers"
            requiredRole={['admin', 'manager', 'supervisor', 'receptionist']}
          >
            <Suspense fallback={<LoadingFallback />}>
              <CustomersModule />
            </Suspense>
          </ProtectedRoute>
        );
      
      case 'staff':
        return (
          <ProtectedRoute 
            requiredPermission="manage_staff"
            requiredRole={['admin', 'manager', 'supervisor']}
          >
            <Suspense fallback={<LoadingFallback />}>
              <StaffModule />
            </Suspense>
          </ProtectedRoute>
        );
      
      case 'invoices':
        return (
          <ProtectedRoute 
            requiredPermission="manage_invoices"
            requiredRole={['admin', 'manager', 'supervisor', 'receptionist']}
          >
            <Suspense fallback={<LoadingFallback />}>
              <InvoicesModule />
            </Suspense>
          </ProtectedRoute>
        );
      
      case 'payments':
        return (
          <ProtectedRoute 
            requiredPermission="manage_payments"
            requiredRole={['admin', 'manager']}
          >
            <Suspense fallback={<LoadingFallback />}>
              <PaymentsModule />
            </Suspense>
          </ProtectedRoute>
        );
      
      case 'reports':
        return (
          <ProtectedRoute 
            requiredPermission="view_reports"
            requiredRole={['admin', 'manager', 'supervisor']}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ReportsModule />
            </Suspense>
          </ProtectedRoute>
        );
      
      case 'settings':
        return (
          <ProtectedRoute 
            requiredPermission="manage_settings"
            requiredRole={['admin']}
          >
            <Suspense fallback={<LoadingFallback />}>
              <SettingsModule />
            </Suspense>
          </ProtectedRoute>
        );
      
      default:
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            {getDashboardByRole()}
          </Suspense>
        );
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Access level indicator for non-global users */}
      {!hasGlobalAccess && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Lodge-specific access:</span> You can only view and manage data for your assigned lodges.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {renderModule()}
    </div>
  );
};

export default DashboardContent;