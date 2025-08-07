import React from 'react';
import { useBookings } from '../../../../hooks/useBookings';
import { useLodges } from '../../../../hooks/useLodges';
import { useAuth } from '../../../../hooks/useAuth';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';

const BookingsFilters: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useBookings();
  const { lodges } = useLodges();
  const { hasGlobalAccess, assignedLodges } = useAuth();

  // Filter lodges based on user access
  const accessibleLodges = hasGlobalAccess 
    ? lodges 
    : lodges.filter(lodge => assignedLodges.includes(lodge.id));

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'checked_in', label: 'Checked In' },
    { value: 'checked_out', label: 'Checked Out' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const paymentStatusOptions = [
    { value: '', label: 'All Payment Status' },
    { value: 'pending', label: 'Pending Payment' },
    { value: 'partial', label: 'Partial Payment' },
    { value: 'paid', label: 'Paid' }
  ];

  const bookingSourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'booking_com', label: 'Booking.com' },
    { value: 'airbnb', label: 'Airbnb' },
    { value: 'phone', label: 'Phone' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Check-in Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.dateRange?.start || ''}
              onChange={(e) => updateFilters({
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              placeholder="Start date"
            />
            <Input
              type="date"
              value={filters.dateRange?.end || ''}
              onChange={(e) => updateFilters({
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              placeholder="End date"
            />
          </div>
        </div>

        {/* Guest Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guest Name
          </label>
          <Input
            placeholder="Search by guest name..."
            value={filters.guestName || ''}
            onChange={(e) => updateFilters({ guestName: e.target.value })}
          />
        </div>

        {/* Lodge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lodge
          </label>
          <select
            value={filters.lodge || ''}
            onChange={(e) => updateFilters({ lodge: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Lodges</option>
            {accessibleLodges.map(lodge => (
              <option key={lodge.id} value={lodge.id}>{lodge.name}</option>
            ))}
          </select>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type
          </label>
          <select
            value={filters.roomType || ''}
            onChange={(e) => updateFilters({ roomType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Room Types</option>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
            <option value="family">Family</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        {/* Booking Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            value={filters.paymentStatus || ''}
            onChange={(e) => updateFilters({ paymentStatus: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {paymentStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Booking Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Source
          </label>
          <select
            value={filters.source || ''}
            onChange={(e) => updateFilters({ source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {bookingSourceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Number of Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="1"
              placeholder="Min"
              value={filters.guestsRange?.min || ''}
              onChange={(e) => updateFilters({
                guestsRange: { 
                  ...filters.guestsRange, 
                  min: parseInt(e.target.value) || undefined 
                }
              })}
            />
            <Input
              type="number"
              min="1"
              placeholder="Max"
              value={filters.guestsRange?.max || ''}
              onChange={(e) => updateFilters({
                guestsRange: { 
                  ...filters.guestsRange, 
                  max: parseInt(e.target.value) || undefined 
                }
              })}
            />
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Quick Filters:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilters({ 
              dateRange: { 
                start: new Date().toISOString().split('T')[0], 
                end: new Date().toISOString().split('T')[0] 
              } 
            })}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            Today's Check-ins
          </button>
          <button
            onClick={() => updateFilters({ 
              dateRange: { 
                start: new Date().toISOString().split('T')[0], 
                end: new Date().toISOString().split('T')[0] 
              },
              status: 'checked_in'
            })}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
          >
            Today's Check-outs
          </button>
          <button
            onClick={() => updateFilters({ status: 'pending' })}
            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
          >
            Pending Bookings
          </button>
          <button
            onClick={() => updateFilters({ paymentStatus: 'pending' })}
            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
          >
            Unpaid Bookings
          </button>
          <button
            onClick={() => updateFilters({ source: 'walk_in' })}
            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
          >
            Walk-in Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsFilters;