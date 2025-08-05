import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'receptionist' | 'cleaner' | 'manager';
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
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

// Define role permissions
const rolePermissions = {
  admin: [
    'view_dashboard', 'manage_lodges', 'manage_bookings', 'manage_customers',
    'manage_staff', 'manage_invoices', 'manage_payments', 'view_reports',
    'manage_settings', 'view_analytics', 'manage_rooms', 'manage_pricing'
  ],
  manager: [
    'view_dashboard', 'manage_bookings', 'manage_customers', 'view_staff',
    'manage_invoices', 'manage_payments', 'view_reports', 'manage_rooms'
  ],
  receptionist: [
    'view_dashboard', 'view_lodges', 'manage_bookings', 'manage_customers',
    'create_invoices', 'view_payments', 'manage_rooms'
  ],
  cleaner: [
    'view_dashboard', 'view_rooms', 'view_bookings', 'update_room_status'
  ]
};

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@harrislodges.com',
    role: 'admin' as const,
    password: 'admin123'
  },
  {
    id: '2',
    name: 'Jane Receptionist',
    email: 'reception@harrislodges.com',
    role: 'receptionist' as const,
    password: 'reception123'
  },
  {
    id: '3',
    name: 'Mike Cleaner',
    email: 'cleaner@harrislodges.com',
    role: 'cleaner' as const,
    password: 'cleaner123'
  },
  {
    id: '4',
    name: 'Sarah Manager',
    email: 'manager@harrislodges.com',
    role: 'manager' as const,
    password: 'manager123'
  }
];

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        return rejectWithValue('Invalid email or password');
      }

      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        permissions: rolePermissions[foundUser.role],
        lastLogin: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('harris_auth_token', 'mock_token_' + foundUser.id);
      localStorage.setItem('harris_user_data', JSON.stringify(userData));

      return userData;
    } catch (error) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userExists = mockUsers.find(u => u.email === email);
      if (!userExists) {
        return rejectWithValue('Email not found');
      }
      
      return { email };
    } catch (error) {
      return rejectWithValue('Password reset failed. Please try again.');
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
        return {
          ...parsedUser,
          permissions: rolePermissions[parsedUser.role as keyof typeof rolePermissions] || []
        };
      }
      
      return null;
    } catch (error) {
      localStorage.removeItem('harris_auth_token');
      localStorage.removeItem('harris_user_data');
      return rejectWithValue('Failed to load user data');
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      // Login cases
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
      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Load user from storage cases
      .addCase(loadUserFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;