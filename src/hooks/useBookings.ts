import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { useAuth } from './useAuth';
import {
  fetchBookings,
  createBooking,
  updateBooking,
  updateBookingStatus,
  cancelBooking,
  updatePaymentStatus,
  setSelectedBooking,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearError,
  updateLocalBooking,
  selectBookings,
  selectSelectedBooking,
  selectBookingsLoading,
  selectBookingsError,
  selectBookingsFilters,
  selectBookingsPagination,
  selectBookingsStats,
  selectBookingsByStatus,
  selectTodaysBookings,
  selectUpcomingCheckIns,
  selectOverduePayments,
  type Booking,
  type BookingFilters
} from '../store/slices/bookingSlice';
import { addNotification } from '../store/slices/uiSlice';

export const useBookings = () => {
  const dispatch = useAppDispatch();
  const { assignedLodges, hasGlobalAccess, userRole, user } = useAuth();
  
  // Selectors
  const bookings = useAppSelector(selectBookings);
  const selectedBooking = useAppSelector(selectSelectedBooking);
  const isLoading = useAppSelector(selectBookingsLoading);
  const error = useAppSelector(selectBookingsError);
  const filters = useAppSelector(selectBookingsFilters);
  const pagination = useAppSelector(selectBookingsPagination);
  const stats = useAppSelector(selectBookingsStats);

  // Complex selectors
  const todaysBookings = useAppSelector(selectTodaysBookings);
  const upcomingCheckIns = useAppSelector(selectUpcomingCheckIns);
  const overduePayments = useAppSelector(selectOverduePayments);

  // CRUD Operations
  const loadBookings = useCallback(async (params?: { page?: number; filters?: Partial<BookingFilters> }) => {
    try {
      const result = await dispatch(fetchBookings({
        ...params,
        userLodges: assignedLodges,
        userRole: userRole
      }));
      if (fetchBookings.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      return { success: false, error: 'Failed to load bookings' };
    }
  }, [dispatch, assignedLodges, userRole]);

  const addBooking = useCallback(async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastModifiedBy'>) => {
    try {
      const result = await dispatch(createBooking(bookingData));
      if (createBooking.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: `Booking for ${bookingData.guestName} created successfully!`
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to create booking'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to create booking'
      }));
      return { success: false, error: 'Failed to create booking' };
    }
  }, [dispatch]);

  const editBooking = useCallback(async (id: string, updates: Partial<Booking>) => {
    try {
      const result = await dispatch(updateBooking({ id, updates }));
      if (updateBooking.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: 'Booking updated successfully!'
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update booking'
        }));
        return { success: false, error: result.payload as string };
        }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update booking'
      }));
      return { success: false, error: 'Failed to update booking' };
    }
  }, [dispatch]);

  const changeBookingStatus = useCallback(async (bookingId: string, status: Booking['status']) => {
    try {
      const result = await dispatch(updateBookingStatus({ id: bookingId, status }));
      if (updateBookingStatus.fulfilled.match(result)) {
        const statusMessages = {
          pending: 'Booking marked as pending',
          confirmed: 'Booking confirmed successfully!',
          checked_in: 'Guest checked in successfully!',
          checked_out: 'Guest checked out successfully!',
          cancelled: 'Booking cancelled successfully!'
        };
        
        dispatch(addNotification({
          type: 'success',
          message: statusMessages[status] || 'Booking status updated!'
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update booking status'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update booking status'
      }));
      return { success: false, error: 'Failed to update booking status' };
    }
  }, [dispatch]);

  const cancelBookingWithReason = useCallback(async (bookingId: string, reason?: string) => {
    try {
      const result = await dispatch(cancelBooking({ id: bookingId, reason }));
      if (cancelBooking.fulfilled.match(result)) {
        dispatch(addNotification({
          type: 'success',
          message: 'Booking cancelled successfully!'
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to cancel booking'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to cancel booking'
      }));
      return { success: false, error: 'Failed to cancel booking' };
    }
  }, [dispatch]);

  const updateBookingPayment = useCallback(async (
    bookingId: string, 
    paymentStatus: Booking['paymentStatus'], 
    paymentMethod?: string, 
    amountPaid?: number
  ) => {
    try {
      const result = await dispatch(updatePaymentStatus({ 
        id: bookingId, 
        paymentStatus, 
        paymentMethod, 
        amountPaid 
      }));
      if (updatePaymentStatus.fulfilled.match(result)) {
        const paymentMessages = {
          pending: 'Payment marked as pending',
          partial: 'Partial payment recorded',
          paid: 'Payment completed successfully!',
          refunded: 'Payment refunded successfully!'
        };
        
        dispatch(addNotification({
          type: 'success',
          message: paymentMessages[paymentStatus] || 'Payment status updated!'
        }));
        return { success: true, data: result.payload };
      } else {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to update payment status'
        }));
        return { success: false, error: result.payload as string };
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update payment status'
      }));
      return { success: false, error: 'Failed to update payment status' };
    }
  }, [dispatch]);

  // UI Actions
  const selectBooking = useCallback((booking: Booking | null) => {
    dispatch(setSelectedBooking(booking));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: Partial<BookingFilters>) => {
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

  const updateBookingLocally = useCallback((bookingId: string, updates: Partial<Booking>) => {
    dispatch(updateLocalBooking({ id: bookingId, updates }));
  }, [dispatch]);

  // Utility functions
  const searchBookings = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return bookings.filter(booking => 
      booking.guestName.toLowerCase().includes(lowercaseQuery) ||
      booking.guestEmail.toLowerCase().includes(lowercaseQuery) ||
      booking.guestPhone.toLowerCase().includes(lowercaseQuery) ||
      booking.lodgeName.toLowerCase().includes(lowercaseQuery) ||
      booking.roomName.toLowerCase().includes(lowercaseQuery) ||
      booking.id.toLowerCase().includes(lowercaseQuery)
    );
  }, [bookings]);

  const getBookingsByStatus = useCallback((status: Booking['status']) => {
    return useAppSelector((state: any) => selectBookingsByStatus(state, status));
  }, []);

  const getBookingsByDateRange = useCallback((startDate: string, endDate: string) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return checkIn >= start && checkIn <= end;
    });
  }, [bookings]);

  const getTodaysCheckIns = useCallback(() => {
    const today = new Date().toDateString();
    return bookings.filter(booking => 
      new Date(booking.checkIn).toDateString() === today && 
      booking.status === 'confirmed'
    );
  }, [bookings]);

  const getTodaysCheckOuts = useCallback(() => {
    const today = new Date().toDateString();
    return bookings.filter(booking => 
      new Date(booking.checkOut).toDateString() === today && 
      booking.status === 'checked_in'
    );
  }, [bookings]);

  const getUpcomingArrivals = useCallback((days: number = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      return checkIn >= today && 
             checkIn <= futureDate && 
             booking.status === 'confirmed';
    });
  }, [bookings]);

  const getUpcomingDepartures = useCallback((days: number = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return bookings.filter(booking => {
      const checkOut = new Date(booking.checkOut);
      return checkOut >= today && 
             checkOut <= futureDate && 
             booking.status === 'checked_in';
    });
  }, [bookings]);

  const calculateRevenue = useCallback((status?: Booking['status'], period?: { start: string; end: string }) => {
    let relevantBookings = bookings;
    
    if (status) {
      relevantBookings = relevantBookings.filter(b => b.status === status);
    } else {
      relevantBookings = relevantBookings.filter(b => b.status !== 'cancelled');
    }
    
    if (period) {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      relevantBookings = relevantBookings.filter(b => {
        const checkIn = new Date(b.checkIn);
        return checkIn >= startDate && checkIn <= endDate;
      });
    }
    
    return relevantBookings.reduce((total, booking) => total + booking.amount, 0);
  }, [bookings]);

  const getOccupancyRate = useCallback((lodgeId?: string, period?: { start: string; end: string }) => {
    let relevantBookings = bookings.filter(b => b.status !== 'cancelled');
    
    if (lodgeId) {
      relevantBookings = relevantBookings.filter(b => b.lodgeId === lodgeId);
    }
    
    if (period) {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      relevantBookings = relevantBookings.filter(b => {
        const checkIn = new Date(b.checkIn);
        const checkOut = new Date(b.checkOut);
        return (checkIn >= startDate && checkIn <= endDate) ||
               (checkOut >= startDate && checkOut <= endDate) ||
               (checkIn <= startDate && checkOut >= endDate);
      });
    }
    
    // This is a simplified calculation
    // In reality, you'd need total available room-nights for the period
    const totalBookedNights = relevantBookings.reduce((total, booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return total + nights;
    }, 0);
    
    // Assuming average 30 rooms available per lodge for 30 days
    const totalAvailableNights = lodgeId ? 900 : 1800; // Mock calculation
    
    return Math.min((totalBookedNights / totalAvailableNights) * 100, 100);
  }, [bookings]);

  const getCancellationRate = useCallback((period?: { start: string; end: string }) => {
    let relevantBookings = bookings;
    
    if (period) {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      relevantBookings = relevantBookings.filter(b => {
        const createdAt = new Date(b.createdAt);
        return createdAt >= startDate && createdAt <= endDate;
      });
    }
    
    const totalBookings = relevantBookings.length;
    const cancelledBookings = relevantBookings.filter(b => b.status === 'cancelled').length;
    
    return totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;
  }, [bookings]);

  const getAverageBookingValue = useCallback((period?: { start: string; end: string }) => {
    let relevantBookings = bookings.filter(b => b.status !== 'cancelled');
    
    if (period) {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      relevantBookings = relevantBookings.filter(b => {
        const checkIn = new Date(b.checkIn);
        return checkIn >= startDate && checkIn <= endDate;
      });
    }
    
    const totalRevenue = relevantBookings.reduce((sum, b) => sum + b.amount, 0);
    return relevantBookings.length > 0 ? totalRevenue / relevantBookings.length : 0;
  }, [bookings]);

  const getBookingsBySource = useCallback((period?: { start: string; end: string }) => {
    let relevantBookings = bookings;
    
    if (period) {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      relevantBookings = relevantBookings.filter(b => {
        const createdAt = new Date(b.createdAt);
        return createdAt >= startDate && createdAt <= endDate;
      });
    }
    
    const sourceStats = relevantBookings.reduce((stats, booking) => {
      stats[booking.bookingSource] = (stats[booking.bookingSource] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);
    
    return Object.entries(sourceStats).map(([source, count]) => ({
      source,
      count,
      percentage: (count / relevantBookings.length) * 100
    }));
  }, [bookings]);

  const getRepeatGuestRate = useCallback(() => {
    const totalGuests = bookings.length;
    const repeatGuests = bookings.filter(b => b.isReturningGuest).length;
    
    return totalGuests > 0 ? (repeatGuests / totalGuests) * 100 : 0;
  }, [bookings]);

  // Memoized computed values
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];
    
    // Apply access-based filtering
    if (!hasGlobalAccess) {
      filtered = filtered.filter(booking => assignedLodges.includes(booking.lodgeId));
    }
    
    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }
    
    if (filters.paymentStatus) {
      filtered = filtered.filter(b => b.paymentStatus === filters.paymentStatus);
    }
    
    if (filters.lodge) {
      filtered = filtered.filter(b => b.lodgeId === filters.lodge);
    }
    
    if (filters.roomType) {
      filtered = filtered.filter(b => b.roomType === filters.roomType);
    }
    
    if (filters.source) {
      filtered = filtered.filter(b => b.bookingSource === filters.source);
    }
    
    if (filters.guestName) {
      const query = filters.guestName.toLowerCase();
      filtered = filtered.filter(b => 
        b.guestName.toLowerCase().includes(query) ||
        b.guestEmail.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [bookings, hasGlobalAccess, assignedLodges, filters]);

  const bookingAlerts = useMemo(() => {
    const alerts = [];
    
    // Today's check-ins
    const todayCheckIns = getTodaysCheckIns();
    if (todayCheckIns.length > 0) {
      alerts.push({
        type: 'info',
        title: `${todayCheckIns.length} Check-ins Today`,
        message: `Guests arriving today: ${todayCheckIns.map(b => b.guestName).join(', ')}`,
        count: todayCheckIns.length
      });
    }
    
    // Today's check-outs
    const todayCheckOuts = getTodaysCheckOuts();
    if (todayCheckOuts.length > 0) {
      alerts.push({
        type: 'info',
        title: `${todayCheckOuts.length} Check-outs Today`,
        message: `Guests departing today: ${todayCheckOuts.map(b => b.guestName).join(', ')}`,
        count: todayCheckOuts.length
      });
    }
    
    // Overdue payments
    if (overduePayments.length > 0) {
      alerts.push({
        type: 'warning',
        title: `${overduePayments.length} Overdue Payments`,
        message: 'Some bookings have overdue payments that need attention.',
        count: overduePayments.length
      });
    }
    
    // Upcoming check-ins (tomorrow)
    if (upcomingCheckIns.length > 0) {
      alerts.push({
        type: 'info',
        title: `${upcomingCheckIns.length} Arrivals Tomorrow`,
        message: 'Prepare for tomorrow\'s check-ins.',
        count: upcomingCheckIns.length
      });
    }
    
    return alerts;
  }, [getTodaysCheckIns, getTodaysCheckOuts, overduePayments, upcomingCheckIns]);

  return {
    // Data
    bookings: filteredBookings,
    selectedBooking,
    isLoading,
    error,
    filters,
    pagination,
    stats,
    todaysBookings,
    upcomingCheckIns,
    overduePayments,
    bookingAlerts,

    // CRUD Operations
    loadBookings,
    addBooking,
    editBooking,
    changeBookingStatus,
    cancelBookingWithReason,
    updateBookingPayment,

    // UI Actions
    selectBooking,
    updateFilters,
    resetFilters,
    changePage,
    clearErrorState,
    updateBookingLocally,

    // Utility Functions
    searchBookings,
    getBookingsByStatus,
    getBookingsByDateRange,
    getTodaysCheckIns,
    getTodaysCheckOuts,
    getUpcomingArrivals,
    getUpcomingDepartures,
    calculateRevenue,
    getOccupancyRate,
    getCancellationRate,
    getAverageBookingValue,
    getBookingsBySource,
    getRepeatGuestRate,
  };
};

export default useBookings;