import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback
}) => {
  const { user, hasPermission, hasRole } = useAuth();

  if (!user) {
    return null; // Will be handled by main App component
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">🔒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: {Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole}</p>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">🔒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to access this feature.</p>
          <p className="text-sm text-gray-500 mt-2">Required permission: {requiredPermission}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;