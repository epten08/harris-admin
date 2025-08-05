import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  currentModule: string;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
  }>;
  loading: {
    [key: string]: boolean;
  };
}

const initialState: UiState = {
  sidebarOpen: false,
  currentModule: 'dashboard',
  notifications: [],
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentModule: (state, action: PayloadAction<string>) => {
      state.currentModule = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
    }>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
    clearLoading: (state) => {
      state.loading = {};
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setCurrentModule,
  addNotification,
  removeNotification,
  setLoading,
  clearLoading,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectSidebarOpen = (state: { ui: UiState }) => state.ui.sidebarOpen;
export const selectCurrentModule = (state: { ui: UiState }) => state.ui.currentModule;
export const selectNotifications = (state: { ui: UiState }) => state.ui.notifications;
export const selectLoading = (state: { ui: UiState }) => state.ui.loading;