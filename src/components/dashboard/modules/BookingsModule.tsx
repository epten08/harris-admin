import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/redux';
import { useAuth } from '../../../hooks/useAuth';
import { useBookings } from '../../../hooks/useBookings';
import { addNotification } from '../../../store/slices/uiSlice';
import { CalendarIcon, ListBulletIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button';
import LoadingSpinner from '../../ui/LoadingSpinner';
import BookingsCalendar from './bookings/BookingsCalendar';
import BookingsList from './bookings/BookingsList';
import BookingForm from './bookings/BookingForm';
import BookingsFilters from './bookings/BookingsFilters';
import BookingsStats from './bookings/BookingsStats';

const BookingsModule: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hasPermission, hasGlobalAccess } = useAuth();
  const { bookings, isLoading, loadBookings, selectBooking, selectedBooking } = useBookings();
  
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleAddBooking = () => {
    if (!hasPermission('manage_bookings') && !hasPermission('manage_bookings_assigned')) {
      dispatch(addNotification({
        type: 'error',
        message: 'You do not have permission to add bookings'
      }));
      return;
    }
    setEditingBooking(null);
    setShowBookingForm(true);
  };

  const handleEditBooking = (booking: any) => {
    if (!hasPermission('manage_bookings') && !hasPermission('manage_bookings_assigned')) {
      dispatch(addNotification({
        type: 'error',
        message: 'You do not have permission to edit bookings'
      }));
      return;
    }
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const handleFormClose = () => {
    setShowBookingForm(false);
    setEditingBooking(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadBookings();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">
            View and manage {hasGlobalAccess ? 'all' : 'assigned'} reservations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ListBulletIcon className="w-4 h-4 mr-2 inline" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4 mr-2 inline" />
              Calendar
            </button>
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {(hasPermission('manage_bookings') || hasPermission('manage_bookings_assigned')) && (
            <Button onClick={handleAddBooking}>
              <PlusIcon className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <BookingsStats />

      {/* Filters */}
      {showFilters && <BookingsFilters />}

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" color="blue" />
        </div>
      ) : viewMode === 'calendar' ? (
        <BookingsCalendar onEditBooking={handleEditBooking} />
      ) : (
        <BookingsList onEditBooking={handleEditBooking} />
      )}

      {/* Forms */}
      {showBookingForm && (
        <BookingForm
          booking={editingBooking}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default BookingsModule;