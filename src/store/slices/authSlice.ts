import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'supervisor' | 'receptionist' | 'cleaner' | 'maintenance';
  avatar?: string;
  permissions: string[];
  assignedLodges: string[]; // Array of lodge IDs the user is assigned to
  isActive: boolean;
  phone?: string;
  address?: string;
  employeeId?: string;
  department?: string;
  dateHired?: string;
  salary?: number;
  supervisor?: string; // ID of supervisor
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Updated role permissions with lodge-specific access
const rolePermissions = {
  admin: {
    permissions: [
      'view_dashboard', 'manage_lodges', 'manage_bookings', 'manage_customers',
      'manage_staff', 'manage_invoices', 'manage_payments', 'view_reports',
      'manage_settings', 'view_analytics', 'manage_rooms', 'manage_pricing',
      'system_admin', 'user_management', 'global_access'
    ],
    accessLevel: 'global' as const
  },
  manager: {
    permissions: [
      'view_dashboard', 'manage_lodges', 'manage_bookings', 'manage_customers',
      'view_staff', 'manage_staff_assigned', 'manage_invoices', 'manage_payments', 
      'view_reports', 'manage_rooms', 'lodge_management'
    ],
    accessLevel: 'global' as const
  },
  supervisor: {
    permissions: [
      'view_dashboard', 'view_lodges', 'manage_bookings', 'manage_customers',
      'view_staff', 'manage_staff_assigned', 'create_invoices', 'view_payments',
      'manage_rooms', 'view_reports_assigned'
    ],
    accessLevel: 'assigned' as const
  },
  receptionist: {
    permissions: [
      'view_dashboard', 'view_lodges_assigned', 'manage_bookings_assigned', 
      'manage_customers_assigned', 'create_invoices', 'view_payments_assigned', 
      'manage_rooms_assigned', 'checkin_checkout'
    ],
    accessLevel: 'assigned' as const
  },
  cleaner: {
    permissions: [
      'view_dashboard', 'view_rooms_assigned', 'view_bookings_assigned', 
      'update_room_status', 'cleaning_schedule', 'maintenance_requests'
    ],
    accessLevel: 'assigned' as const
  },
  maintenance: {
    permissions: [
      'view_dashboard', 'view_rooms_assigned', 'update_room_status',
      'maintenance_schedule', 'maintenance_reports', 'inventory_management'
    ],
    accessLevel: 'assigned' as const
  }
};

// Updated mock users with lodge assignments
const mockUsers = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@harrislodges.com',
    role: 'admin' as const,
    password: 'admin123',
    assignedLodges: [], // Admin has access to all lodges
    isActive: true,
    employeeId: 'EMP001',
    department: 'Administration'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@harrislodges.com',
    role: 'manager' as const,
    password: 'manager123',
    assignedLodges: [], // Manager has access to all lodges
    isActive: true,
    employeeId: 'EMP002',
    department: 'Operations'
  },
  {
    id: '3',
    name: 'Mike Supervisor',
    email: 'supervisor@harrislodges.com',
    role: 'supervisor' as const,
    password: 'supervisor123',
    assignedLodges: ['1', '2'], // Assigned to Victoria Falls and Hwange
    isActive: true,
    employeeId: 'EMP003',
    department: 'Operations'
  },
  {
    id: '4',
    name: 'Jane Receptionist',
    email: 'reception@harrislodges.com',
    role: 'receptionist' as const,
    password: 'reception123',
    assignedLodges: ['1'], // Only Victoria Falls Lodge
    isActive: true,
    employeeId: 'EMP004',
    department: 'Front Desk',
    supervisor: '3'
  },
  {
    id: '5',
    name: 'Tom Cleaner',
    email: 'cleaner@harrislodges.com',
    role: 'cleaner' as const,
    password: 'cleaner123',
    assignedLodges: ['1'], // Only Victoria Falls Lodge
    isActive: true,
    employeeId: 'EMP005',
    department: 'Housekeeping',
    supervisor: '3'
  },
  {
    id: '6',
    name: 'Lisa Maintenance',
    email: 'maintenance@harrislodges.com',
    role: 'maintenance' as const,
    password: 'maintenance123',
    assignedLodges: ['1', '2'], // Both lodges
    isActive: true,
    employeeId: 'EMP006',
    department: 'Maintenance',
    supervisor: '3'
  }
];

// Updated login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return rejectWithValue('Invalid email or password');
      }

      if (!foundUser.isActive) {
        return rejectWithValue('Account is deactivated. Please contact your administrator.');
      }

      const roleConfig = rolePermissions[foundUser.role];
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        permissions: roleConfig.permissions,
        assignedLodges: foundUser.assignedLodges,
        isActive: foundUser.isActive,
        employeeId: foundUser.employeeId,
        department: foundUser.department,
        supervisor: foundUser.supervisor,
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('harris_auth_token', 'mock_token_' + foundUser.id);
      localStorage.setItem('harris_user_data', JSON.stringify(userData));

      return userData;
    } catch (error) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('harris_auth_token');
      const userData = localStorage.getItem('harris_user_data');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        
        // Validate the user data structure
        if (!parsedUser.id || !parsedUser.email || !parsedUser.role) {
          throw new Error('Invalid user data structure');
        }
        
        // Ensure permissions are set based on role
        const roleConfig = rolePermissions[parsedUser.role as keyof typeof rolePermissions];
        
        return {
          ...parsedUser,
          permissions: roleConfig?.permissions || [],
          assignedLodges: parsedUser.assignedLodges || []
        };
      }
      
      return null;
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem('harris_auth_token');
      localStorage.removeItem('harris_user_data');
      return rejectWithValue('Failed to load user data from storage');
    }
  }
);


// Rest of the slice remains the same but add new selectors
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('harris_auth_token');
      localStorage.removeItem('harris_user_data');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('harris_user_data', JSON.stringify(state.user));
      }
    },
    updateAssignedLodges: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.assignedLodges = action.payload;
        state.user.updatedAt = new Date().toISOString();
        localStorage.setItem('harris_user_data', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(loadUserFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromStorage.fulfilled,(state,action) => {
        state.isLoading = false;
        if(action.payload) {
            state.user = action.payload;
            state.isAuthenticated = true;
        }
      })
      .addCase(loadUserFromStorage.rejected,(state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateUser, updateAssignedLodges } = authSlice.actions;
export default authSlice.reducer;

// Enhanced selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectAssignedLodges = (state: { auth: AuthState }) => state.auth.user?.assignedLodges || [];
export const selectHasGlobalAccess = (state: { auth: AuthState }) => {
  const role = state.auth.user?.role;
  return role === 'admin' || role === 'manager';
};