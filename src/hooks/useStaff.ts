import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { useAuth } from './useAuth';
import {
  fetchStaff,
  createStaffMember,
  updateStaffMember,
  assignStaffToLodge,
  setSelectedStaff,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearError,
  selectStaff,
  selectSelectedStaff,
  selectStaffLoading,
  selectStaffError,
  selectStaffFilters,
  selectStaffPagination,
  selectStaffByLodge,
  selectStaffByRole,
  type StaffMember
} from '../store/slices/staffSlice';
import { addNotification } from '../store/slices/uiSlice';

export const useStaff = () => {
  const dispatch = useAppDispatch();
  const { user, assignedLodges, hasGlobalAccess, userRole } = useAuth();
  
  // Selectors
  const staff = useAppSelector(selectStaff);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const isLoading = useAppSelector(selectStaffLoading);
  const error = useAppSelector(selectStaffError);
  const filters = useAppSelector(selectStaffFilters);
  const pagination = useAppSelector(selectStaffPagination);

  // Actions
  const loadStaff = useCallback(async (params?: { page?: number; filters?: any }) => {
    try {
      const result = await dispatch(fetchStaff({
        ...params,
        userLodges: assignedLodges,
        userRole: userRole
      }));
      if (fetchStaff.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      return { success: false, error: 'Failed to load staff' };
    }
  }, [dispatch, assignedLodges, userRole]);

  const addStaffMember = useCallback(async (staffData: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'permissions'>) => {
    try {
      const result = await dispatch(createStaffMember(staffData));
      if (createStaffMember.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: `Staff member "${staffData.name}" added successfully!`
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to add staff member'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to add staff member'
      }));
      return { success: false, error: 'Failed to add staff member' };
    }
  }, [dispatch]);

  const editStaffMember = useCallback(async (id: string, updates: Partial<StaffMember>) => {
    try {
      const result = await dispatch(updateStaffMember({ id, updates }));
      if (updateStaffMember.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: 'Staff member updated successfully!'
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update staff member'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update staff member'
      }));
      return { success: false, error: 'Failed to update staff member' };
    }
  }, [dispatch]);

  const assignToLodge = useCallback(async (staffId: string, lodgeIds: string[]) => {
    try {
      const result = await dispatch(assignStaffToLodge({ staffId, lodgeIds }));
      if (assignStaffToLodge.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: 'Staff assignment updated successfully!'
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update staff assignment'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update staff assignment'
      }));
      return { success: false, error: 'Failed to update staff assignment' };
    }
  }, [dispatch]);

  // UI Actions
  const selectStaffMember = useCallback((staffMember: StaffMember | null) => {
    dispatch(setSelectedStaff(staffMember));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const changePage = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Utility functions
  const getStaffByLodge = useCallback((lodgeId: string) => {
    return selectStaffByLodge({ staff: { staff, selectedStaff, isLoading, error, filters, pagination } }, lodgeId);
  }, [staff, selectedStaff, isLoading, error, filters, pagination]);

  const getStaffByRole = useCallback((role: string) => {
    return selectStaffByRole({ staff: { staff, selectedStaff, isLoading, error, filters, pagination } }, role);
  }, [staff, selectedStaff, isLoading, error, filters, pagination]);

  const getAccessibleStaff = useCallback(() => {
    if (hasGlobalAccess) return staff;
    
    return staff.filter(staffMember => 
      staffMember.assignedLodges.some(lodgeId => assignedLodges.includes(lodgeId)) ||
      staffMember.assignedLodges.length === 0
    );
  }, [staff, hasGlobalAccess, assignedLodges]);

  const canManageStaffMember = useCallback((staffMember: StaffMember) => {
    if (!user) return false;
    
    // Admin and Manager can manage all staff
    if (hasGlobalAccess) return true;
    
    // Supervisors can manage staff in their assigned lodges
    if (user.role === 'supervisor') {
      return staffMember.assignedLodges.some(lodgeId => assignedLodges.includes(lodgeId));
    }
    
    return false;
  }, [user, hasGlobalAccess, assignedLodges]);

  return {
    // Data
    staff: getAccessibleStaff(),
    selectedStaff,
    isLoading,
    error,
    filters,
    pagination,

    // CRUD Operations
    loadStaff,
    addStaffMember,
    editStaffMember,
    assignToLodge,

    // UI Actions
    selectStaffMember,
    updateFilters,
    resetFilters,
    changePage,
    clearErrorState,

    // Utility Functions
    getStaffByLodge,
    getStaffByRole,
    canManageStaffMember,
  };
};