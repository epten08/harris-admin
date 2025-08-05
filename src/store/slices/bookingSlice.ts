import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  lodgeId: string;
  lodgeName: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'checked_in' | 'checked_out';
  amount: number;
  deposit: number;
  balance: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  bookingSource: 'website' | 'walk_in' | 'booking_com' | 'airbnb' | 'phone';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingsState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    dateRange: {
      start: string;
      end: string;
    };
    lodge: string;
    source: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: BookingsState = {
  bookings: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    dateRange: {
      start: '',
      end: ''
    },
    lodge: 'all',
    source: 'all'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

// Mock data
const mockBookings: Booking[] = [
  {
    id: '1',
    guestName: 'John Smith',
    guestEmail: 'john@example.com',
    guestPhone: '+263777123456',
    lodgeId: '1',
    lodgeName: 'Victoria Lodge',
    roomId: '101',
    roomName: 'Suite 101',
    checkIn: '2025-08-06',
    checkOut: '2025-08-08',
    guests: 2,
    status: 'confirmed',
    amount: 450,
    deposit: 200,
    balance: 250,
    paymentStatus: 'partial',
    bookingSource: 'website',
    specialRequests: 'Late check-in requested',
    createdAt: '2025-08-05T10:00:00Z',
    updatedAt: '2025-08-05T10:00:00Z'
  },
  {
    id: '2',
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah@example.com',
    guestPhone: '+263777654321',
    lodgeId: '2',
    lodgeName: 'Garden Lodge',
    roomId: '205',
    roomName: 'Room 205',
    checkIn: '2025-08-07',
    checkOut: '2025-08-10',
    guests: 1,
    status: 'pending',
    amount: 320,
    deposit: 0,
    balance: 320,
    paymentStatus: 'pending',
    bookingSource: 'booking_com',
    createdAt: '2025-08-05T14:30:00Z',
    updatedAt: '2025-08-05T14:30:00Z'
  }
];

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params: { page?: number; filters?: any }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredBookings = [...mockBookings];
      
      // Apply filters
      if (params.filters?.status && params.filters.status !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.status === params.filters.status);
      }
      
      if (params.filters?.lodge && params.filters.lodge !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.lodgeId === params.filters.lodge);
      }
      
      const totalItems = filteredBookings.length;
      const itemsPerPage = 10;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const currentPage = params.page || 1;
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);
      
      return {
        bookings: paginatedBookings,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch bookings');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }: { id: string; status: Booking['status'] }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { id, status, updatedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue('Failed to update booking status');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newBooking;
    } catch (error) {
      return rejectWithValue('Failed to create booking');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<BookingsState['filters']>>) => {
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
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update booking status
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const booking = state.bookings.find(b => b.id === action.payload.id);
        if (booking) {
          booking.status = action.payload.status;
          booking.updatedAt = action.payload.updatedAt;
        }
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage, clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;

// Selectors
export const selectBookings = (state: { bookings: BookingsState }) => state.bookings.bookings;
export const selectBookingsLoading = (state: { bookings: BookingsState }) => state.bookings.isLoading;
export const selectBookingsError = (state: { bookings: BookingsState }) => state.bookings.error;
export const selectBookingsFilters = (state: { bookings: BookingsState }) => state.bookings.filters;
export const selectBookingsPagination = (state: { bookings: BookingsState }) => state.bookings.pagination;