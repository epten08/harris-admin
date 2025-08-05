import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  loginUser,
  logout,
  resetPassword,
  loadUserFromStorage,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

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

  const handleResetPassword = useCallback(async (email: string) => {
    try {
      const result = await dispatch(resetPassword(email));
      if (resetPassword.fulfilled.match(result)) {
        return { success: true };
      } else {
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      return { success: false, error: 'Password reset failed' };
    }
  }, [dispatch]);

  const loadUser = useCallback(() => {
    dispatch(loadUserFromStorage());
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

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    loadUser,
    clearError: handleClearError,
    hasPermission,
    hasRole,
  };
};