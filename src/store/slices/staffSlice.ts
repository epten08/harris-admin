import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type User } from './authSlice';

export interface StaffMember extends User {
  shift?: {
    start: string;
    end: string;
    days: string[]; // ['monday', 'tuesday', etc.]
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  performance?: {
    rating: number;
    lastReview: string;
    nextReview: string;
  };
}

interface StaffState {
  staff: StaffMember[];
  selectedStaff: StaffMember | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    role: string;
    lodge: string;
    status: 'all' | 'active' | 'inactive';
    department: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: StaffState = {
  staff: [],
  selectedStaff: null,
  isLoading: false,
  error: null,
  filters: {
    role: 'all',
    lodge: 'all',
    status: 'all',
    department: 'all'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

// Mock staff data
const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@harrislodges.com',
    role: 'admin',
    permissions: [],
    assignedLodges: [],
    isActive: true,
    employeeId: 'EMP001',
    department: 'Administration',
    phone: '+263 4 123 4567',
    dateHired: '2023-01-15',
    salary: 5000,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2025-08-06T10:00:00Z',
    shift: {
      start: '08:00',
      end: '17:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }
  },
  {
    id: '4',
    name: 'Jane Receptionist',
    email: 'reception@harrislodges.com',
    role: 'receptionist',
    permissions: [],
    assignedLodges: ['1'],
    isActive: true,
    employeeId: 'EMP004',
    department: 'Front Desk',
    phone: '+263 77 123 4567',
    supervisor: '3',
    dateHired: '2024-03-01',
    salary: 1200,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2025-08-06T10:00:00Z',
    shift: {
      start: '06:00',
      end: '14:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    emergencyContact: {
      name: 'Mary Johnson',
      phone: '+263 77 987 6543',
      relationship: 'Sister'
    },
    performance: {
      rating: 4.5,
      lastReview: '2024-12-01',
      nextReview: '2025-06-01'
    }
  },
  {
    id: '5',
    name: 'Tom Cleaner',
    email: 'cleaner@harrislodges.com',
    role: 'cleaner',
    permissions: [],
    assignedLodges: ['1'],
    isActive: true,
    employeeId: 'EMP005',
    department: 'Housekeeping',
    phone: '+263 77 234 5678',
    supervisor: '3',
    dateHired: '2024-02-15',
    salary: 800,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2025-08-06T10:00:00Z',
    shift: {
      start: '07:00',
      end: '15:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    notes: 'Excellent attention to detail. Reliable and punctual.'
  }
];

// Async thunks
export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (params: { 
    page?: number; 
    filters?: any; 
    userLodges?: string[]; 
    userRole?: string 
  }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredStaff = [...mockStaff];
      
      // Apply lodge filtering based on user permissions
      if (params.userRole && !['admin', 'manager'].includes(params.userRole)) {
        // Filter staff to only show those in the same lodges
        filteredStaff = filteredStaff.filter(staff => 
          staff.assignedLodges.some(lodge => params.userLodges?.includes(lodge)) ||
          staff.assignedLodges.length === 0 // Global staff
        );
      }
      
      // Apply filters
      if (params.filters?.role && params.filters.role !== 'all') {
        filteredStaff = filteredStaff.filter(s => s.role === params.filters.role);
      }
      
      if (params.filters?.lodge && params.filters.lodge !== 'all') {
        filteredStaff = filteredStaff.filter(s => 
          s.assignedLodges.includes(params.filters.lodge) ||
          s.assignedLodges.length === 0
        );
      }
      
      if (params.filters?.status && params.filters.status !== 'all') {
        const isActive = params.filters.status === 'active';
        filteredStaff = filteredStaff.filter(s => s.isActive === isActive);
      }
      
      if (params.filters?.department && params.filters.department !== 'all') {
        filteredStaff = filteredStaff.filter(s => s.department === params.filters.department);
      }
      
      const totalItems = filteredStaff.length;
      const itemsPerPage = 10;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const currentPage = params.page || 1;
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedStaff = filteredStaff.slice(startIndex, startIndex + itemsPerPage);
      
      return {
        staff: paginatedStaff,
        pagination: {
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch staff');
    }
  }
);

export const createStaffMember = createAsyncThunk(
  'staff/createStaffMember',
  async (staffData: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt' | 'permissions'>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStaff: StaffMember = {
        ...staffData,
        id: Date.now().toString(),
        permissions: [], // Will be set based on role
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return newStaff;
    } catch (error) {
      return rejectWithValue('Failed to create staff member');
    }
  }
);

export const updateStaffMember = createAsyncThunk(
  'staff/updateStaffMember',
  async ({ id, updates }: { id: string; updates: Partial<StaffMember> }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        id,
        updates: {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return rejectWithValue('Failed to update staff member');
    }
  }
);

export const assignStaffToLodge = createAsyncThunk(
  'staff/assignStaffToLodge',
  async ({ staffId, lodgeIds }: { staffId: string; lodgeIds: string[] }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { staffId, lodgeIds, updatedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue('Failed to assign staff to lodge');
    }
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setSelectedStaff: (state, action: PayloadAction<StaffMember | null>) => {
      state.selectedStaff = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<StaffState['filters']>>) => {
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
      .addCase(fetchStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staff = action.payload.staff;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createStaffMember.fulfilled, (state, action) => {
        state.staff.unshift(action.payload);
      })
      .addCase(updateStaffMember.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const staffIndex = state.staff.findIndex(s => s.id === id);
        if (staffIndex !== -1) {
          state.staff[staffIndex] = { ...state.staff[staffIndex], ...updates };
        }
        if (state.selectedStaff?.id === id) {
          state.selectedStaff = { ...state.selectedStaff, ...updates };
        }
      })
      .addCase(assignStaffToLodge.fulfilled, (state, action) => {
        const { staffId, lodgeIds, updatedAt } = action.payload;
        const staff = state.staff.find(s => s.id === staffId);
        if (staff) {
          staff.assignedLodges = lodgeIds;
          staff.updatedAt = updatedAt;
        }
        if (state.selectedStaff?.id === staffId) {
          state.selectedStaff.assignedLodges = lodgeIds;
          state.selectedStaff.updatedAt = updatedAt;
        }
      });
  },
});

export const {
  setSelectedStaff,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearError,
} = staffSlice.actions;

export default staffSlice.reducer;

// Selectors
export const selectStaff = (state: { staff: StaffState }) => state.staff.staff;
export const selectSelectedStaff = (state: { staff: StaffState }) => state.staff.selectedStaff;
export const selectStaffLoading = (state: { staff: StaffState }) => state.staff.isLoading;
export const selectStaffError = (state: { staff: StaffState }) => state.staff.error;
export const selectStaffFilters = (state: { staff: StaffState }) => state.staff.filters;
export const selectStaffPagination = (state: { staff: StaffState }) => state.staff.pagination;
export const selectStaffByLodge = (state: { staff: StaffState }, lodgeId: string) =>
  state.staff.staff.filter(s => s.assignedLodges.includes(lodgeId));
export const selectStaffByRole = (state: { staff: StaffState }, role: string) =>
  state.staff.staff.filter(s => s.role === role);