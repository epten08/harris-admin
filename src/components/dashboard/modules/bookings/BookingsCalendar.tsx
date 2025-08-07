import React, { useState, useMemo } from 'react';
import { useBookings } from '../../../../hooks/useBookings';
import { useLodges } from '../../../../hooks/useLodges';
import { useAuth } from '../../../../hooks/useAuth';
import { type Booking } from '../../../../store/slices/bookingSlice';
import BookingStatusBadge from './BookingStatusBadge';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Button from '../../../ui/Button';

interface BookingsCalendarProps {
  onEditBooking: (booking: Booking) => void;
}

const BookingsCalendar: React.FC<BookingsCalendarProps> = ({ onEditBooking }) => {
  const { bookings } = useBookings();
  const { lodges } = useLodges();
  const { hasGlobalAccess, assignedLodges } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedLodge, setSelectedLodge] = useState<string>('');

  // Filter lodges based on user access
  const accessibleLodges = useMemo(() => {
    return hasGlobalAccess 
      ? lodges 
      : lodges.filter(lodge => assignedLodges.includes(lodge.id));
  }, [lodges, hasGlobalAccess, assignedLodges]);

  // Get calendar date range
  const getCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    if (viewMode === 'month') {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
      
      return { startDate, endDate };
    } else if (viewMode === 'week') {
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      
      return { startDate, endDate };
    } else { // day
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      
      return { startDate, endDate };
    }
  };

  const { startDate, endDate } = getCalendarDates();

  // Filter bookings for the current view
  const filteredBookings = useMemo(() => {
    let filtered = bookings.filter(booking => {
      if (selectedLodge && booking.lodgeId !== selectedLodge) {
        return false;
      }
      
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      // Check if booking overlaps with the calendar period
      return (checkIn <= endDate && checkOut >= startDate);
    });
    
    return filtered;
  }, [bookings, selectedLodge, startDate, endDate]);

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const dates = [];
    const currentDateIter = new Date(startDate);
    
    while (currentDateIter <= endDate) {
      dates.push(new Date(currentDateIter));
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    return dates;
  };

  const calendarDates = generateCalendarGrid();

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      // Check if the date falls within the booking period
      return date >= checkIn && date < checkOut;
    });
  };

  // Navigation functions
  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else { // day
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format date for display
  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    
    if (viewMode === 'week') {
      const weekEnd = new Date(startDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    return currentDate.toLocaleDateString('en-US', options);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  if (viewMode === 'month') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Calendar Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {formatDateHeader()}
              </h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateCalendar('prev')}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateCalendar('next')}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                  className="ml-2"
                >
                  Today
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Lodge Filter */}
              <select
                value={selectedLodge}
                onChange={(e) => setSelectedLodge(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Lodges</option>
                {accessibleLodges.map(lodge => (
                  <option key={lodge.id} value={lodge.id}>{lodge.name}</option>
                ))}
              </select>
              
              {/* View Mode Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['month', 'week', 'day'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                      viewMode === mode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-px mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {calendarDates.map((date, index) => {
              const dayBookings = getBookingsForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] bg-white p-2 ${
                    !isCurrentMonthDay ? 'bg-gray-50 text-gray-400' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isTodayDate 
                      ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' 
                      : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map(booking => (
                      <div
                        key={booking.id}
                        onClick={() => onEditBooking(booking)}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: getBookingColor(booking.status, 0.1),
                          borderLeft: `3px solid ${getBookingColor(booking.status, 1)}`
                        }}
                      >
                        <div className="font-medium truncate">
                          {booking.guestName}
                        </div>
                        <div className="text-gray-600 truncate">
                          {booking.roomName}
                        </div>
                      </div>
                    ))}
                    
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Week and Day views would be similar but with different layouts
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center py-12">
        <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {viewMode === 'week' ? 'Week View' : 'Day View'}
        </h3>
        <p className="text-gray-600 mb-4">
          This view is coming soon. Please use the month view for now.
        </p>
        <Button onClick={() => setViewMode('month')}>
          Switch to Month View
        </Button>
      </div>
    </div>
  );
};

// Helper function to get booking colors
const getBookingColor = (status: Booking['status'], opacity: number) => {
  const colors = {
    pending: `rgba(251, 191, 36, ${opacity})`, // yellow
    confirmed: `rgba(59, 130, 246, ${opacity})`, // blue
    checked_in: `rgba(16, 185, 129, ${opacity})`, // green
    checked_out: `rgba(139, 92, 246, ${opacity})`, // purple
    cancelled: `rgba(239, 68, 68, ${opacity})`, // red
  };
  
  return colors[status] || `rgba(156, 163, 175, ${opacity})`;
};

export default BookingsCalendar;