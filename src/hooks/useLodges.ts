import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  fetchLodges,
  fetchLodgeById,
  createLodge,
  updateLodge,
  deleteLodge,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
  setSelectedLodge,
  setSelectedRoom,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearError,
  updateLocalRoomStatus,
  selectLodges,
  selectSelectedLodge,
  selectSelectedRoom,
  selectLodgesLoading,
  selectLodgesError,
  selectLodgesFilters,
  selectLodgesPagination,
  selectRoomStatuses,
  selectTotalRooms,
  selectAvailableRooms,
  selectOverallOccupancyRate,
  type Lodge,
  type Room
} from '../store/slices/lodgeSlice';
import { addNotification } from '../store/slices/uiSlice';

export const useLodges = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const lodges = useAppSelector(selectLodges);
  const selectedLodge = useAppSelector(selectSelectedLodge);
  const selectedRoom = useAppSelector(selectSelectedRoom);
  const isLoading = useAppSelector(selectLodgesLoading);
  const error = useAppSelector(selectLodgesError);
  const filters = useAppSelector(selectLodgesFilters);
  const pagination = useAppSelector(selectLodgesPagination);
  const roomStatuses = useAppSelector(selectRoomStatuses);
  const totalRooms = useAppSelector(selectTotalRooms);
  const availableRooms = useAppSelector(selectAvailableRooms);
  const occupancyRate = useAppSelector(selectOverallOccupancyRate);

  // Actions
  const loadLodges = useCallback(async (params?: { page?: number; filters?: any }) => {
    try {
      const result = await dispatch(fetchLodges(params || {}));
      if (fetchLodges.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      return { success: false, error: 'Failed to load lodges' };
    }
  }, [dispatch]);

  const loadLodgeById = useCallback(async (lodgeId: string) => {
    try {
      const result = await dispatch(fetchLodgeById(lodgeId));
      if (fetchLodgeById.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      return { success: false, error: 'Failed to load lodge' };
    }
  }, [dispatch]);

  const addLodge = useCallback(async (lodgeData: Omit<Lodge, 'id' | 'createdAt' | 'updatedAt' | 'rooms' | 'totalRooms' | 'availableRooms' | 'occupancyRate'>) => {
    try {
      const result = await dispatch(createLodge(lodgeData));
      if (createLodge.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: `Lodge "${lodgeData.name}" created successfully!`
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to create lodge'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create lodge'
      }));
      return { success: false, error: 'Failed to create lodge' };
    }
  }, [dispatch]);

  const editLodge = useCallback(async (id: string, updates: Partial<Lodge>) => {
    try {
      const result = await dispatch(updateLodge({ id, updates }));
      if (updateLodge.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: 'Lodge updated successfully!'
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update lodge'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update lodge'
      }));
      return { success: false, error: 'Failed to update lodge' };
    }
  }, [dispatch]);

  const removeLodge = useCallback(async (lodgeId: string, lodgeName?: string) => {
    try {
      const result = await dispatch(deleteLodge(lodgeId));
      if (deleteLodge.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: `Lodge ${lodgeName ? `"${lodgeName}"` : ''} deleted successfully!`
        }));
        return { success: true };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to delete lodge'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete lodge'
      }));
      return { success: false, error: 'Failed to delete lodge' };
    }
  }, [dispatch]);

  const addRoom = useCallback(async (lodgeId: string, roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await dispatch(createRoom({ lodgeId, roomData }));
      if (createRoom.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: `Room "${roomData.name}" added successfully!`
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to add room'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to add room'
      }));
      return { success: false, error: 'Failed to add room' };
    }
  }, [dispatch]);

  const editRoom = useCallback(async (lodgeId: string, roomId: string, updates: Partial<Room>) => {
    try {
      const result = await dispatch(updateRoom({ lodgeId, roomId, updates }));
      if (updateRoom.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: 'Room updated successfully!'
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update room'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update room'
      }));
      return { success: false, error: 'Failed to update room' };
    }
  }, [dispatch]);

  const changeRoomStatus = useCallback(async (lodgeId: string, roomId: string, status: Room['status'], roomName?: string) => {
    // Optimistic update
    dispatch(updateLocalRoomStatus({ lodgeId, roomId, status }));
    
    try {
      const result = await dispatch(updateRoomStatus({ lodgeId, roomId, status }));
      if (updateRoomStatus.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: `Room ${roomName ? `"${roomName}"` : ''} status updated to ${status}!`
        }));
        return { success: true, data: result.payload };
      } else {
        // Revert optimistic update on failure
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update room status'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update room status'
      }));
      return { success: false, error: 'Failed to update room status' };
    }
  }, [dispatch]);

  const removeRoom = useCallback(async (lodgeId: string, roomId: string, roomName?: string) => {
    try {
      const result = await dispatch(deleteRoom({ lodgeId, roomId }));
      if (deleteRoom.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: `Room ${roomName ? `"${roomName}"` : ''} deleted successfully!`
        }));
        return { success: true };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to delete room'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to delete room'
      }));
      return { success: false, error: 'Failed to delete room' };
    }
  }, [dispatch]);

  // UI Actions
  const selectLodge = useCallback((lodge: Lodge | null) => {
    dispatch(setSelectedLodge(lodge));
  }, [dispatch]);

  const selectRoom = useCallback((room: Room | null) => {
    dispatch(setSelectedRoom(room));
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
  const getLodgeById = useCallback((lodgeId: string) => {
    return lodges.find(lodge => lodge.id === lodgeId);
  }, [lodges]);

  const getRoomById = useCallback((lodgeId: string, roomId: string) => {
    const lodge = getLodgeById(lodgeId);
    return lodge?.rooms.find(room => room.id === roomId);
  }, [getLodgeById]);

  const getRoomsByStatus = useCallback((status: Room['status']) => {
    return lodges.flatMap(lodge => 
      lodge.rooms.filter(room => room.status === status).map(room => ({
        ...room,
        lodgeName: lodge.name,
        lodgeId: lodge.id
      }))
    );
  }, [lodges]);

  const getActiveLodges = useCallback(() => {
    return lodges.filter(lodge => lodge.isActive);
  }, [lodges]);

  const searchLodges = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return lodges.filter(lodge => 
      lodge.name.toLowerCase().includes(lowercaseQuery) ||
      lodge.address.city.toLowerCase().includes(lowercaseQuery) ||
      lodge.address.state.toLowerCase().includes(lowercaseQuery) ||
      lodge.description.toLowerCase().includes(lowercaseQuery)
    );
  }, [lodges]);

  const searchRooms = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return lodges.flatMap(lodge =>
      lodge.rooms.filter(room =>
        room.name.toLowerCase().includes(lowercaseQuery) ||
        room.number.toLowerCase().includes(lowercaseQuery) ||
        room.type.toLowerCase().includes(lowercaseQuery)
      ).map(room => ({
        ...room,
        lodgeName: lodge.name,
        lodgeId: lodge.id
      }))
    );
  }, [lodges]);

  const getOccupancyStats = useCallback(() => {
    const stats = {
      totalLodges: lodges.length,
      activeLodges: lodges.filter(l => l.isActive).length,
      totalRooms,
      availableRooms,
      occupiedRooms: totalRooms - availableRooms,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      maintenanceRooms: roomStatuses.maintenance,
      outOfOrderRooms: roomStatuses.outOfOrder,
      cleaningRooms: roomStatuses.cleaning
    };
    return stats;
  }, [lodges, totalRooms, availableRooms, occupancyRate, roomStatuses]);

  return {
    // Data
    lodges,
    selectedLodge,
    selectedRoom,
    isLoading,
    error,
    filters,
    pagination,
    roomStatuses,
    totalRooms,
    availableRooms,
    occupancyRate,

    // CRUD Operations
    loadLodges,
    loadLodgeById,
    addLodge,
    editLodge,
    removeLodge,
    addRoom,
    editRoom,
    changeRoomStatus,
    removeRoom,

    // UI Actions
    selectLodge,
    selectRoom,
    updateFilters,
    resetFilters,
    changePage,
    clearErrorState,

    // Utility Functions
    getLodgeById,
    getRoomById,
    getRoomsByStatus,
    getActiveLodges,
    searchLodges,
    searchRooms,
    getOccupancyStats,
  };
};