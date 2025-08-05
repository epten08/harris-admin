import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../auth/ProtectedRoute';
import AdminDashboard from './AdminDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import CleanerDashboard from './CleanerDashboard';
import ManagerDashboard from './ManagerDashboard';
import LodgesModule from './modules/LodgesModule';
import BookingsModule from './modules/BookingModule';
import CustomersModule from './modules/CustomerModule';
import StaffModule from './modules/StaffModule';
import InvoicesModule from './modules/InvoiceModule';
import PaymentsModule from './modules/PaymentsModule';
import ReportsModule from './modules/ReportsMoudule';
import SettingsModule from './modules/SettingsModule';

interface DashboardContentProps {
  module: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ module }) => {
  const { user } = useAuth();

  const getDashboardByRole = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'cleaner':
        return <CleanerDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  const renderModule = () => {
    switch (module) {
      case 'dashboard':
        return getDashboardByRole();
      
      case 'lodges':
        return (
          <ProtectedRoute requiredPermission="manage_lodges">
            <LodgesModule />
          </ProtectedRoute>
        );
      
      case 'bookings':
        return (
          <ProtectedRoute requiredPermission="manage_bookings">
            <BookingsModule />
          </ProtectedRoute>
        );
      
      case 'customers':
        return (
          <ProtectedRoute requiredPermission="manage_customers">
            <CustomersModule />
          </ProtectedRoute>
        );
      
      case 'staff':
        return (
          <ProtectedRoute requiredPermission="manage_staff">
            <StaffModule />
          </ProtectedRoute>
        );
      
      case 'invoices':
        return (
          <ProtectedRoute requiredPermission="manage_invoices">
            <InvoicesModule />
          </ProtectedRoute>
        );
      
      case 'payments':
        return (
          <ProtectedRoute requiredPermission="manage_payments">
            <PaymentsModule />
          </ProtectedRoute>
        );
      
      case 'reports':
        return (
          <ProtectedRoute requiredPermission="view_reports">
            <ReportsModule />
          </ProtectedRoute>
        );
      
      case 'settings':
        return (
          <ProtectedRoute requiredPermission="manage_settings">
            <SettingsModule />
          </ProtectedRoute>
        );
      
      default:
        return getDashboardByRole();
    }
  };

  return (
    <div className="animate-fadeIn">
      {renderModule()}
    </div>
  );
};

export default DashboardContent;