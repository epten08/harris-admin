import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Room {
  id: string;
  number: string;
  name: string;
  type: 'standard' | 'deluxe' | 'suite' | 'family' | 'executive';
  capacity: number;
  beds: {
    single: number;
    double: number;
    queen: number;
    king: number;
  };
  amenities: string[];
  images: string[];
  pricing: {
    normal: number;
    busy: number;
    slow: number;
  };
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_order' | 'cleaning';
  description: string;
  size: number; // square meters
  view: string;
  floor: number;
  isActive: boolean;
  lastCleaned?: string;
  nextMaintenance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lodge {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  amenities: string[];
  images: string[];
  rooms: Room[];
  facilities: {
    conferenceRooms?: number;
    restaurant?: boolean;
    gym?: boolean;
    spa?: boolean;
    pool?: boolean;
    parking?: boolean;
    wifi?: boolean;
    laundry?: boolean;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    petPolicy?: string;
    smokingPolicy: string;
  };
  rating: number;
  totalRooms: number;
  availableRooms: number;
  occupancyRate: number;
  isActive: boolean;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

interface LodgesState {
  lodges: Lodge[];
  selectedLodge: Lodge | null;
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: 'all' | 'active' | 'inactive';
    location: string;
    amenities: string[];
    roomTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  roomStatuses: {
    available: number;
    occupied: number;
    maintenance: number;
    outOfOrder: number;
    cleaning: number;
  };
}

const initialState: LodgesState = {
  lodges: [],
  selectedLodge: null,
  selectedRoom: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    location: '',
    amenities: [],
    roomTypes: [],
    priceRange: {
      min: 0,
      max: 1000
    }
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  roomStatuses: {
    available: 0,
    occupied: 0,
    maintenance: 0,
    outOfOrder: 0,
    cleaning: 0
  }
};

// Mock data for development
const mockLodges: Lodge[] = [
  {
    id: '1',
    name: 'Victoria Falls Lodge',
    description: 'Luxury lodge overlooking the magnificent Victoria Falls with world-class amenities and breathtaking views.',
    address: {
      street: '1 Victoria Falls Drive',
      city: 'Victoria Falls',
      state: 'Matabeleland North',
      country: 'Zimbabwe',
      zipCode: '00263',
      coordinates: {
        lat: -17.9243,
        lng: 25.8572
      }
    },
    contact: {
      phone: '+263 13 44751',
      email: 'info@victoriafallslodge.com',
      website: 'https://victoriafallslodge.com'
    },
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Conference Rooms', 'Gym', 'Parking'],
    images: [
      '/images/lodges/victoria-falls-1.jpg',
      '/images/lodges/victoria-falls-2.jpg',
      '/images/lodges/victoria-falls-3.jpg'
    ],
    rooms: [
      {
        id: 'r1',
        number: '101',
        name: 'Victoria Suite',
        type: 'suite',
        capacity: 4,
        beds: { single: 0, double: 0, queen: 1, king: 1 },
        amenities: ['Balcony', 'Mini Bar', 'Safe', 'Air Conditioning', 'Room Service'],
        images: ['/images/rooms/suite-101-1.jpg'],
        pricing: { normal: 450, busy: 550, slow: 350 },
        status: 'available',
        description: 'Spacious suite with panoramic views of Victoria Falls',
        size: 85,
        view: 'Falls View',
        floor: 1,
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2025-08-05T10:00:00Z'
      },
      {
        id: 'r2',
        number: '102',
        name: 'Garden Deluxe',
        type: 'deluxe',
        capacity: 2,
        beds: { single: 0, double: 0, queen: 1, king: 0 },
        amenities: ['Garden View', 'Mini Bar', 'Safe', 'Air Conditioning'],
        images: ['/images/rooms/deluxe-102-1.jpg'],
        pricing: { normal: 280, busy: 350, slow: 220 },
        status: 'occupied',
        description: 'Elegant room with beautiful garden views',
        size: 45,
        view: 'Garden View',
        floor: 1,
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2025-08-05T10:00:00Z'
      }
    ],
    facilities: {
      conferenceRooms: 3,
      restaurant: true,
      gym: true,
      spa: true,
      pool: true,
      parking: true,
      wifi: true,
      laundry: true
    },
    policies: {
      checkIn: '15:00',
      checkOut: '11:00',
      cancellation: '24 hours before arrival',
      petPolicy: 'Pets allowed with additional fee',
      smokingPolicy: 'No smoking in rooms'
    },
    rating: 4.8,
    totalRooms: 24,
    availableRooms: 18,
    occupancyRate: 75,
    isActive: true,
    managerId: 'mgr1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-08-05T10:00:00Z'
  },
  {
    id: '2',
    name: 'Hwange Safari Lodge',
    description: 'Experience the African wilderness at our safari lodge near Hwange National Park.',
    address: {
      street: 'Hwange National Park Road',
      city: 'Hwange',
      state: 'Matabeleland North',
      country: 'Zimbabwe',
      zipCode: '00264',
      coordinates: {
        lat: -18.6297,
        lng: 26.6056
      }
    },
    contact: {
      phone: '+263 18 8202',
      email: 'reservations@hwangesafari.com',
      website: 'https://hwangesafari.com'
    },
    amenities: ['WiFi', 'Restaurant', 'Game Drives', 'Campfire Area', 'Conference Room'],
    images: [
      '/images/lodges/hwange-1.jpg',
      '/images/lodges/hwange-2.jpg'
    ],
    rooms: [
      {
        id: 'r3',
        number: '201',
        name: 'Safari Tent',
        type: 'standard',
        capacity: 2,
        beds: { single: 2, double: 0, queen: 0, king: 0 },
        amenities: ['Mosquito Net', 'Fan', 'Private Bathroom', 'Safari View'],
        images: ['/images/rooms/safari-tent-1.jpg'],
        pricing: { normal: 180, busy: 220, slow: 150 },
        status: 'available',
        description: 'Authentic safari tent with modern amenities',
        size: 35,
        view: 'Safari View',
        floor: 1,
        isActive: true,
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2025-08-05T10:00:00Z'
      }
    ],
    facilities: {
      conferenceRooms: 1,
      restaurant: true,
      gym: false,
      spa: false,
      pool: false,
      parking: true,
      wifi: true,
      laundry: true
    },
    policies: {
      checkIn: '14:00',
      checkOut: '10:00',
      cancellation: '48 hours before arrival',
      smokingPolicy: 'Smoking allowed in designated areas only'
    },
    rating: 4.5,
    totalRooms: 16,
    availableRooms: 12,
    occupancyRate: 62.5,
    isActive: true,
    managerId: 'mgr2',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2025-08-05T10:00:00Z'
  }
];

// Async thunks
export const fetchLodges = createAsyncThunk(
  'lodges/fetchLodges',
  async (params: { page?: number; filters?: any }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredLodges = [...mockLodges];
      
      // Apply filters
      if (params.filters?.status && params.filters.status !== 'all') {
        const isActive = params.filters.status === 'active';
        filteredLodges = filteredLodges.filter(lodge => lodge.isActive === isActive);
      }
      
      if (params.filters?.location) {
        filteredLodges = filteredLodges.filter(lodge => 
          lodge.address.city.toLowerCase().includes(params.filters.location.toLowerCase()) ||
          lodge.name.toLowerCase().includes(params.filters.location.toLowerCase())
        );
      }
      
      if (params.filters?.amenities?.length > 0) {
        filteredLodges = filteredLodges.filter(lodge =>
          params.filters.amenities.some((amenity: string) => lodge.amenities.includes(amenity))
        );
      }
      
      const totalItems = filteredLodges.length;
      const itemsPerPage = 10;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const currentPage = params.page || 1;
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedLodges = filteredLodges.slice(startIndex, startIndex + itemsPerPage);
      
      // Calculate room statuses
      const roomStatuses = filteredLodges.reduce((acc, lodge) => {
        lodge.rooms.forEach(room => {
          acc[room.status]++;
        });
        return acc;
      }, { available: 0, occupied: 0, maintenance: 0, outOfOrder: 0, cleaning: 0 });
      
      return {
        lodges: paginatedLodges,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage
        },
        roomStatuses
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch lodges');
    }
  }
);

export const fetchLodgeById = createAsyncThunk(
  'lodges/fetchLodgeById',
  async (lodgeId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const lodge = mockLodges.find(l => l.id === lodgeId);
      if (!lodge) {
        return rejectWithValue('Lodge not found');
      }
      
      return lodge;
    } catch (error) {
      return rejectWithValue('Failed to fetch lodge');
    }
  }
);

export const createLodge = createAsyncThunk(
  'lodges/createLodge',
  async (lodgeData: Omit<Lodge, 'id' | 'createdAt' | 'updatedAt' | 'rooms' | 'totalRooms' | 'availableRooms' | 'occupancyRate'>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLodge: Lodge = {
        ...lodgeData,
        id: Date.now().toString(),
        rooms: [],
        totalRooms: 0,
        availableRooms: 0,
        occupancyRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newLodge;
    } catch (error) {
      return rejectWithValue('Failed to create lodge');
    }
  }
);

export const updateLodge = createAsyncThunk(
  'lodges/updateLodge',
  async ({ id, updates }: { id: string; updates: Partial<Lodge> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        id,
        updates: {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to update lodge');
    }
  }
);

export const deleteLodge = createAsyncThunk(
  'lodges/deleteLodge',
  async (lodgeId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return lodgeId;
    } catch (error) {
      return rejectWithValue('Failed to delete lodge');
    }
  }
);

export const createRoom = createAsyncThunk(
  'lodges/createRoom',
  async ({ lodgeId, roomData }: { 
    lodgeId: string; 
    roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'> 
  }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newRoom: Room = {
        ...roomData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return { lodgeId, room: newRoom };
    } catch (error) {
      return rejectWithValue('Failed to create room');
    }
  }
);

export const updateRoom = createAsyncThunk(
  'lodges/updateRoom',
  async ({ 
    lodgeId, 
    roomId, 
    updates 
  }: { 
    lodgeId: string; 
    roomId: string; 
    updates: Partial<Room> 
  }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        lodgeId,
        roomId,
        updates: {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to update room');
    }
  }
);

export const updateRoomStatus = createAsyncThunk(
  'lodges/updateRoomStatus',
  async ({ 
    lodgeId, 
    roomId, 
    status 
  }: { 
    lodgeId: string; 
    roomId: string; 
    status: Room['status'] 
  }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { lodgeId, roomId, status, updatedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue('Failed to update room status');
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'lodges/deleteRoom',
  async ({ lodgeId, roomId }: { lodgeId: string; roomId: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { lodgeId, roomId };
    } catch (error) {
      return rejectWithValue('Failed to delete room');
    }
  }
);

const lodgesSlice = createSlice({
  name: 'lodges',
  initialState,
  reducers: {
    setSelectedLodge: (state, action: PayloadAction<Lodge | null>) => {
      state.selectedLodge = action.payload;
    },
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LodgesState['filters']>>) => {
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
    updateLocalRoomStatus: (state, action: PayloadAction<{
      lodgeId: string;
      roomId: string;
      status: Room['status'];
    }>) => {
      const { lodgeId, roomId, status } = action.payload;
      const lodge = state.lodges.find(l => l.id === lodgeId);
      if (lodge) {
        const room = lodge.rooms.find(r => r.id === roomId);
        if (room) {
          room.status = status;
          room.updatedAt = new Date().toISOString();
        }
      }
      if (state.selectedLodge?.id === lodgeId) {
        const room = state.selectedLodge.rooms.find(r => r.id === roomId);
        if (room) {
          room.status = status;
          room.updatedAt = new Date().toISOString();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lodges
      .addCase(fetchLodges.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLodges.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lodges = action.payload.lodges;
        state.pagination = action.payload.pagination;
        state.roomStatuses = action.payload.roomStatuses;
      })
      .addCase(fetchLodges.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch lodge by ID
      .addCase(fetchLodgeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLodgeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedLodge = action.payload;
      })
      .addCase(fetchLodgeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create lodge
      .addCase(createLodge.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLodge.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lodges.unshift(action.payload);
      })
      .addCase(createLodge.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update lodge
      .addCase(updateLodge.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const lodgeIndex = state.lodges.findIndex(l => l.id === id);
        if (lodgeIndex !== -1) {
          state.lodges[lodgeIndex] = { ...state.lodges[lodgeIndex], ...updates };
        }
        if (state.selectedLodge?.id === id) {
          state.selectedLodge = { ...state.selectedLodge, ...updates };
        }
      })
      
      // Delete lodge
      .addCase(deleteLodge.fulfilled, (state, action) => {
        state.lodges = state.lodges.filter(l => l.id !== action.payload);
        if (state.selectedLodge?.id === action.payload) {
          state.selectedLodge = null;
        }
      })
      
      // Create room
      .addCase(createRoom.fulfilled, (state, action) => {
        const { lodgeId, room } = action.payload;
        const lodge = state.lodges.find(l => l.id === lodgeId);
        if (lodge) {
          lodge.rooms.push(room);
          lodge.totalRooms = lodge.rooms.length;
          lodge.availableRooms = lodge.rooms.filter(r => r.status === 'available').length;
          lodge.occupancyRate = ((lodge.totalRooms - lodge.availableRooms) / lodge.totalRooms) * 100;
        }
        if (state.selectedLodge?.id === lodgeId) {
          state.selectedLodge.rooms.push(room);
          state.selectedLodge.totalRooms = state.selectedLodge.rooms.length;
          state.selectedLodge.availableRooms = state.selectedLodge.rooms.filter(r => r.status === 'available').length;
          state.selectedLodge.occupancyRate = ((state.selectedLodge.totalRooms - state.selectedLodge.availableRooms) / state.selectedLodge.totalRooms) * 100;
        }
      })
      
      // Update room
      .addCase(updateRoom.fulfilled, (state, action) => {
        const { lodgeId, roomId, updates } = action.payload;
        const lodge = state.lodges.find(l => l.id === lodgeId);
        if (lodge) {
          const roomIndex = lodge.rooms.findIndex(r => r.id === roomId);
          if (roomIndex !== -1) {
            lodge.rooms[roomIndex] = { ...lodge.rooms[roomIndex], ...updates };
          }
        }
        if (state.selectedLodge?.id === lodgeId) {
          const roomIndex = state.selectedLodge.rooms.findIndex(r => r.id === roomId);
          if (roomIndex !== -1) {
            state.selectedLodge.rooms[roomIndex] = { ...state.selectedLodge.rooms[roomIndex], ...updates };
          }
        }
      })
      
      // Update room status
      .addCase(updateRoomStatus.fulfilled, (state, action) => {
        const { lodgeId, roomId, status, updatedAt } = action.payload;
        const lodge = state.lodges.find(l => l.id === lodgeId);
        if (lodge) {
          const room = lodge.rooms.find(r => r.id === roomId);
          if (room) {
            room.status = status;
            room.updatedAt = updatedAt;
          }
          // Recalculate availability
          lodge.availableRooms = lodge.rooms.filter(r => r.status === 'available').length;
          lodge.occupancyRate = lodge.totalRooms > 0 ? ((lodge.totalRooms - lodge.availableRooms) / lodge.totalRooms) * 100 : 0;
        }
        if (state.selectedLodge?.id === lodgeId) {
          const room = state.selectedLodge.rooms.find(r => r.id === roomId);
          if (room) {
            room.status = status;
            room.updatedAt = updatedAt;
          }
          // Recalculate availability
          state.selectedLodge.availableRooms = state.selectedLodge.rooms.filter(r => r.status === 'available').length;
          state.selectedLodge.occupancyRate = state.selectedLodge.totalRooms > 0 ? ((state.selectedLodge.totalRooms - state.selectedLodge.availableRooms) / state.selectedLodge.totalRooms) * 100 : 0;
        }
      })
      
      // Delete room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        const { lodgeId, roomId } = action.payload;
        const lodge = state.lodges.find(l => l.id === lodgeId);
        if (lodge) {
          lodge.rooms = lodge.rooms.filter(r => r.id !== roomId);
          lodge.totalRooms = lodge.rooms.length;
          lodge.availableRooms = lodge.rooms.filter(r => r.status === 'available').length;
          lodge.occupancyRate = lodge.totalRooms > 0 ? ((lodge.totalRooms - lodge.availableRooms) / lodge.totalRooms) * 100 : 0;
        }
        if (state.selectedLodge?.id === lodgeId) {
          state.selectedLodge.rooms = state.selectedLodge.rooms.filter(r => r.id !== roomId);
          state.selectedLodge.totalRooms = state.selectedLodge.rooms.length;
          state.selectedLodge.availableRooms = state.selectedLodge.rooms.filter(r => r.status === 'available').length;
          state.selectedLodge.occupancyRate = state.selectedLodge.totalRooms > 0 ? ((state.selectedLodge.totalRooms - state.selectedLodge.availableRooms) / state.selectedLodge.totalRooms) * 100 : 0;
        }
        if (state.selectedRoom?.id === roomId) {
          state.selectedRoom = null;
        }
      });
  },
});

export const {
  setSelectedLodge,
  setSelectedRoom,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearError,
  updateLocalRoomStatus,
} = lodgesSlice.actions;

export default lodgesSlice.reducer;

// Selectors
export const selectLodges = (state: { lodges: LodgesState }) => state.lodges.lodges;
export const selectSelectedLodge = (state: { lodges: LodgesState }) => state.lodges.selectedLodge;
export const selectSelectedRoom = (state: { lodges: LodgesState }) => state.lodges.selectedRoom;
export const selectLodgesLoading = (state: { lodges: LodgesState }) => state.lodges.isLoading;
export const selectLodgesError = (state: { lodges: LodgesState }) => state.lodges.error;
export const selectLodgesFilters = (state: { lodges: LodgesState }) => state.lodges.filters;
export const selectLodgesPagination = (state: { lodges: LodgesState }) => state.lodges.pagination;
export const selectRoomStatuses = (state: { lodges: LodgesState }) => state.lodges.roomStatuses;

// Computed selectors
export const selectTotalRooms = (state: { lodges: LodgesState }) => 
  state.lodges.lodges.reduce((total, lodge) => total + lodge.totalRooms, 0);

export const selectAvailableRooms = (state: { lodges: LodgesState }) => 
  state.lodges.lodges.reduce((total, lodge) => total + lodge.availableRooms, 0);

export const selectOverallOccupancyRate = (state: { lodges: LodgesState }) => {
  const totalRooms = selectTotalRooms(state);
  const availableRooms = selectAvailableRooms(state);
  return totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms) * 100 : 0;
};

export const selectLodgesByStatus = (state: { lodges: LodgesState }, status: 'active' | 'inactive') =>
  state.lodges.lodges.filter(lodge => lodge.isActive === (status === 'active'));

export const selectRoomsByStatus = (state: { lodges: LodgesState }, status: Room['status']) =>
  state.lodges.lodges.flatMap(lodge => lodge.rooms).filter(room => room.status === status);