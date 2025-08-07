import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string;
  guestNationality?: string;
  guestIdNumber?: string;
  lodgeId: string;
  lodgeName: string;
  roomId: string;
  roomName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  amount: number;
  deposit: number;
  balance: number;
  currency: string;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentMethod?: string;
  bookingSource: 'website' | 'walk_in' | 'booking_com' | 'airbnb' | 'phone' | 'agent';
  specialRequests?: string;
  notes?: string;
  cancellationReason?: string;
  checkInTime?: string;
  checkOutTime?: string;
  roomRate: number;
  taxes: number;
  discounts: number;
  extraCharges: number;
  isReturningGuest: boolean;
  loyaltyDiscountApplied: boolean;
  cancellationDeadline: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface BookingFilters {
  status: string;
  paymentStatus: string;
  dateRange: {
    start: string;
    end: string;
  };
  lodge: string;
  roomType: string;
  source: string;
  guestName: string;
  guestsRange: {
    min?: number;
    max?: number;
  };
  amountRange: {
    min?: number;
    max?: number;
  };
}

interface BookingsState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  filters: BookingFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  stats: {
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    occupancyRate: number;
    cancellationRate: number;
    todayCheckIns: number;
    todayCheckOuts: number;
    pendingBookings: number;
    confirmedBookings: number;
  };
}

const initialState: BookingsState = {
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  filters: {
    status: '',
    paymentStatus: '',
    dateRange: {
      start: '',
      end: ''
    },
    lodge: '',
    roomType: '',
    source: '',
    guestName: '',
    guestsRange: {
      min: undefined,
      max: undefined
    },
    amountRange: {
      min: undefined,
      max: undefined
    }
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  },
  stats: {
    totalBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    occupancyRate: 0,
    cancellationRate: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  }
};

// Mock booking data for development
const generateMockBookings = (): Booking[] => {
  const mockBookings: Booking[] = [];
  const lodges = [
    { id: '1', name: 'Victoria Falls Lodge' },
    { id: '2', name: 'Hwange Safari Lodge' }
  ];
  const rooms = [
    { id: 'r1', name: 'Victoria Suite', type: 'suite' },
    { id: 'r2', name: 'Garden Deluxe', type: 'deluxe' },
    { id: 'r3', name: 'Safari Tent', type: 'standard' }
  ];
  const guests = [
    { name: 'John Smith', email: 'john@example.com', phone: '+263777123456' },
    { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+263777654321' },
    { name: 'Mike Wilson', email: 'mike@example.com', phone: '+263777987654' },
    { name: 'Lisa Brown', email: 'lisa@example.com', phone: '+263777456789' },
    { name: 'David Chen', email: 'david@example.com', phone: '+263777159753' }
  ];

  const statuses: Booking['status'][] = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];
  const paymentStatuses: Booking['paymentStatus'][] = ['pending', 'partial', 'paid'];
  const sources: Booking['bookingSource'][] = ['website', 'walk_in', 'booking_com', 'airbnb', 'phone'];

  for (let i = 0; i < 50; i++) {
    const lodge = lodges[Math.floor(Math.random() * lodges.length)];
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const guest = guests[Math.floor(Math.random() * guests.length)];
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 60) - 30);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
    
    const roomRate = 100 + Math.floor(Math.random() * 400);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = roomRate * nights;
    const taxes = subtotal * 0.15;
    const amount = subtotal + taxes;
    const deposit = Math.random() > 0.5 ? amount * 0.3 : 0;

    mockBookings.push({
      id: `booking_${Date.now()}_${i}`,
      guestName: guest.name,
      guestEmail: guest.email,
      guestPhone: guest.phone,
      guestAddress: '123 Main St, City, Country',
      guestNationality: 'Zimbabwe',
      lodgeId: lodge.id,
      lodgeName: lodge.name,
      roomId: room.id,
      roomName: room.name,
      roomType: room.type,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      guests: Math.floor(Math.random() * 4) + 1,
      adults: Math.floor(Math.random() * 3) + 1,
      children: Math.floor(Math.random() * 2),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: Math.round(amount * 100) / 100,
      deposit: Math.round(deposit * 100) / 100,
      balance: Math.round((amount - deposit) * 100) / 100,
      currency: 'USD',
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      paymentMethod: Math.random() > 0.5 ? 'card' : 'cash',
      bookingSource: sources[Math.floor(Math.random() * sources.length)],
      specialRequests: Math.random() > 0.7 ? 'Late check-in requested' : undefined,
      roomRate,
      taxes: Math.round(taxes * 100) / 100,
      discounts: 0,
      extraCharges: 0,
      isReturningGuest: Math.random() > 0.7,
      loyaltyDiscountApplied: false,
      cancellationDeadline: new Date(checkInDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      lastModifiedBy: 'system'
    });
  }

  return mockBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const mockBookings = generateMockBookings();

// Helper function to calculate stats
const calculateStats = (bookings: Booking[]) => {
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + b.amount, 0);
  const averageBookingValue = totalRevenue / (activeBookings.length || 1);
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const cancellationRate = (cancelledBookings / totalBookings) * 100;
  
  const today = new Date().toDateString();
  const todayCheckIns = bookings.filter(b => 
    new Date(b.checkIn).toDateString() === today && b.status === 'confirmed'
  ).length;
  const todayCheckOuts = bookings.filter(b => 
    new Date(b.checkOut).toDateString() === today && b.status === 'checked_in'
  ).length;
  
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

  return {
    totalBookings,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageBookingValue: Math.round(averageBookingValue * 100) / 100,
    occupancyRate: 75, // This would be calculated based on room availability
    cancellationRate: Math.round(cancellationRate * 100) / 100,
    todayCheckIns,
    todayCheckOuts,
    pendingBookings,
    confirmedBookings
  };
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params: { 
    page?: number; 
    filters?: Partial<BookingFilters>; 
    userLodges?: string[]; 
    userRole?: string 
  }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredBookings = [...mockBookings];
      
      // Apply access-based filtering
      if (params.userRole && !['admin', 'manager'].includes(params.userRole) && params.userLodges) {
        filteredBookings = filteredBookings.filter(booking => 
          params.userLodges!.includes(booking.lodgeId)
        );
      }
      
      // Apply filters
      if (params.filters?.status) {
        filteredBookings = filteredBookings.filter(b => b.status === params.filters!.status);
      }
      
      if (params.filters?.paymentStatus) {
        filteredBookings = filteredBookings.filter(b => b.paymentStatus === params.filters!.paymentStatus);
      }
      
      if (params.filters?.lodge) {
        filteredBookings = filteredBookings.filter(b => b.lodgeId === params.filters!.lodge);
      }
      
      if (params.filters?.roomType) {
        filteredBookings = filteredBookings.filter(b => b.roomType === params.filters!.roomType);
      }
      
      if (params.filters?.source) {
        filteredBookings = filteredBookings.filter(b => b.bookingSource === params.filters!.source);
      }
      
      if (params.filters?.guestName) {
        const query = params.filters.guestName.toLowerCase();
        filteredBookings = filteredBookings.filter(b => 
          b.guestName.toLowerCase().includes(query) ||
          b.guestEmail.toLowerCase().includes(query)
        );
      }
      
      if (params.filters?.dateRange?.start && params.filters?.dateRange?.end) {
        const startDate = new Date(params.filters.dateRange.start);
        const endDate = new Date(params.filters.dateRange.end);
        filteredBookings = filteredBookings.filter(b => {
          const checkIn = new Date(b.checkIn);
          return checkIn >= startDate && checkIn <= endDate;
        });
      }
      
      if (params.filters?.guestsRange?.min || params.filters?.guestsRange?.max) {
        filteredBookings = filteredBookings.filter(b => {
          const min = params.filters!.guestsRange!.min || 0;
          const max = params.filters!.guestsRange!.max || Infinity;
          return b.guests >= min && b.guests <= max;
        });
      }
      
      if (params.filters?.amountRange?.min || params.filters?.amountRange?.max) {
        filteredBookings = filteredBookings.filter(b => {
          const min = params.filters!.amountRange!.min || 0;
          const max = params.filters!.amountRange!.max || Infinity;
          return b.amount >= min && b.amount <= max;
        });
      }
      
      // Calculate pagination
      const totalItems = filteredBookings.length;
      const itemsPerPage = 20;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const currentPage = params.page || 1;
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);
      
      // Calculate stats
      const stats = calculateStats(filteredBookings);
      
      return {
        bookings: paginatedBookings,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage
        },
        stats
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch bookings');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastModifiedBy'>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBooking: Booking = {
        ...bookingData,
        id: `booking_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current_user',
        lastModifiedBy: 'current_user'
      };
      
      return newBooking;
    } catch (error) {
      return rejectWithValue('Failed to create booking');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, updates }: { id: string; updates: Partial<Booking> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id,
        updates: {
          ...updates,
          updatedAt: new Date().toISOString(),
          lastModifiedBy: 'current_user'
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to update booking');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }: { id: string; status: Booking['status'] }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updates: Partial<Booking> = {
        status,
        updatedAt: new Date().toISOString(),
        lastModifiedBy: 'current_user'
      };
      
      // Add status-specific updates
      if (status === 'checked_in') {
        updates.checkInTime = new Date().toISOString();
      } else if (status === 'checked_out') {
        updates.checkOutTime = new Date().toISOString();
        updates.paymentStatus = 'paid'; // Auto-mark as paid on checkout
      }
      
      return { id, updates };
    } catch (error) {
      return rejectWithValue('Failed to update booking status');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ id, reason }: { id: string; reason?: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updates: Partial<Booking> = {
        status: 'cancelled',
        cancellationReason: reason,
        updatedAt: new Date().toISOString(),
        lastModifiedBy: 'current_user'
      };
      
      return { id, updates };
    } catch (error) {
      return rejectWithValue('Failed to cancel booking');
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'bookings/updatePaymentStatus',
  async ({ 
    id, 
    paymentStatus, 
    paymentMethod, 
    amountPaid 
  }: { 
    id: string; 
    paymentStatus: Booking['paymentStatus']; 
    paymentMethod?: string;
    amountPaid?: number;
  }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const updates: Partial<Booking> = {
        paymentStatus,
        paymentMethod,
        updatedAt: new Date().toISOString(),
        lastModifiedBy: 'current_user'
      };
      
      // Update deposit/balance if amount is provided
      if (amountPaid !== undefined) {
        updates.deposit = amountPaid;
        updates.balance = (updates.amount || 0) - amountPaid;
      }
      
      return { id, updates };
    } catch (error) {
      return rejectWithValue('Failed to update payment status');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<BookingFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLocalBooking: (state, action: PayloadAction<{ id: string; updates: Partial<Booking> }>) => {
      const { id, updates } = action.payload;
      const booking = state.bookings.find(b => b.id === id);
      if (booking) {
        Object.assign(booking, updates);
      }
      if (state.selectedBooking?.id === id) {
        Object.assign(state.selectedBooking, updates);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload);
        // Recalculate stats
        state.stats = calculateStats(state.bookings);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update booking
      .addCase(updateBooking.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const booking = state.bookings.find(b => b.id === id);
        if (booking) {
          Object.assign(booking, updates);
        }
        if (state.selectedBooking?.id === id) {
          Object.assign(state.selectedBooking, updates);
        }
        // Recalculate stats
        state.stats = calculateStats(state.bookings);
      })
      
      // Update booking status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const booking = state.bookings.find(b => b.id === id);
        if (booking) {
          Object.assign(booking, updates);
        }
        if (state.selectedBooking?.id === id) {
          Object.assign(state.selectedBooking, updates);
        }
        // Recalculate stats
        state.stats = calculateStats(state.bookings);
      })
      
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const booking = state.bookings.find(b => b.id === id);
        if (booking) {
          Object.assign(booking, updates);
        }
        if (state.selectedBooking?.id === id) {
          Object.assign(state.selectedBooking, updates);
        }
        // Recalculate stats
        state.stats = calculateStats(state.bookings);
      })
      
      // Update payment status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const booking = state.bookings.find(b => b.id === id);
        if (booking) {
          Object.assign(booking, updates);
        }
        if (state.selectedBooking?.id === id) {
          Object.assign(state.selectedBooking, updates);
        }
      });
  },
});

export const {
  setSelectedBooking,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearError,
  updateLocalBooking,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;

// Selectors
export const selectBookings = (state: { bookings: BookingsState }) => state.bookings.bookings;
export const selectSelectedBooking = (state: { bookings: BookingsState }) => state.bookings.selectedBooking;
export const selectBookingsLoading = (state: { bookings: BookingsState }) => state.bookings.isLoading;
export const selectBookingsError = (state: { bookings: BookingsState }) => state.bookings.error;
export const selectBookingsFilters = (state: { bookings: BookingsState }) => state.bookings.filters;
export const selectBookingsPagination = (state: { bookings: BookingsState }) => state.bookings.pagination;
export const selectBookingsStats = (state: { bookings: BookingsState }) => state.bookings.stats;

// Complex selectors
export const selectBookingsByStatus = (state: { bookings: BookingsState }, status: Booking['status']) =>
  state.bookings.bookings.filter(booking => booking.status === status);

export const selectBookingsByLodge = (state: { bookings: BookingsState }, lodgeId: string) =>
  state.bookings.bookings.filter(booking => booking.lodgeId === lodgeId);

export const selectTodaysBookings = (state: { bookings: BookingsState }) => {
  const today = new Date().toDateString();
  return state.bookings.bookings.filter(booking => 
    new Date(booking.checkIn).toDateString() === today ||
    new Date(booking.checkOut).toDateString() === today
  );
};

export const selectUpcomingCheckIns = (state: { bookings: BookingsState }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toDateString();
  
  return state.bookings.bookings.filter(booking => 
    new Date(booking.checkIn).toDateString() === tomorrowStr && 
    booking.status === 'confirmed'
  );
};

export const selectOverduePayments = (state: { bookings: BookingsState }) => {
  const today = new Date();
  return state.bookings.bookings.filter(booking => {
    const checkIn = new Date(booking.checkIn);
    return booking.paymentStatus === 'pending' && 
           booking.status !== 'cancelled' && 
           checkIn <= today;
  });
};

export const selectRevenueByPeriod = (state: { bookings: BookingsState }, startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return state.bookings.bookings
    .filter(booking => {
      const checkIn = new Date(booking.checkIn);
      return checkIn >= start && checkIn <= end && booking.status !== 'cancelled';
    })
    .reduce((total, booking) => total + booking.amount, 0);
};