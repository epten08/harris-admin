import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  loginUser,
  logout,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
  selectAssignedLodges,
  selectHasGlobalAccess
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const userRole = useAppSelector(selectUserRole);
  const assignedLodges = useAppSelector(selectAssignedLodges);
  const hasGlobalAccess = useAppSelector(selectHasGlobalAccess);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        return { success: true };
      } else {
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const hasPermission = useCallback((permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  }, [user]);

  const hasRole = useCallback((role: string | string[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  const hasLodgeAccess = useCallback((lodgeId: string): boolean => {
    if (!user) return false;
    
    // Admin and Manager have access to all lodges
    if (hasGlobalAccess) return true;
    
    // Other roles need to be assigned to the lodge
    return user.assignedLodges.includes(lodgeId);
  }, [user, hasGlobalAccess]);

  const canAccessLodgeData = useCallback((lodgeId: string, permission: string): boolean => {
    if (!user) return false;
    
    // Check both permission and lodge access
    return hasPermission(permission) && hasLodgeAccess(lodgeId);
  }, [hasPermission, hasLodgeAccess]);

  const getAccessibleLodges = useCallback((allLodges: string[]): string[] => {
    if (!user) return [];
    
    // Admin and Manager can access all lodges
    if (hasGlobalAccess) return allLodges;
    
    // Other roles only access assigned lodges
    return user.assignedLodges.filter(lodgeId => allLodges.includes(lodgeId));
  }, [user, hasGlobalAccess]);

  const canManageStaff = useCallback((staffMember: { assignedLodges: string[] }): boolean => {
    if (!user) return false;
    
    // Admin and Manager can manage all staff
    if (hasGlobalAccess) return true;
    
    // Supervisors can manage staff in their assigned lodges
    if (user.role === 'supervisor') {
      return staffMember.assignedLodges.some(lodgeId => user.assignedLodges.includes(lodgeId));
    }
    
    return false;
  }, [user, hasGlobalAccess]);

  const isStaffSupervisor = useCallback((staffId: string): boolean => {
    return user?.id === staffId;
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    assignedLodges,
    hasGlobalAccess,
    login,
    logout: handleLogout,
    clearError: handleClearError,
    hasPermission,
    hasRole,
    hasLodgeAccess,
    canAccessLodgeData,
    getAccessibleLodges,
    canManageStaff,
    isStaffSupervisor,
  };
};