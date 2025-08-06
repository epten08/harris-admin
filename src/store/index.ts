import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import bookingsReducer from './slices/bookingSlice';
import lodgesReducer from './slices/lodgeSlice';
import staffReducer from './slices/staffSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    bookings: bookingsReducer,
    lodges: lodgesReducer,
    staff: staffReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;