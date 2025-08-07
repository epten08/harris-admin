import React, { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useBookings } from '../../../../hooks/useBookings';
import { useLodges } from '../../../../hooks/useLodges';
import BookingCard from './BookingCard';
import BookingStatusBadge from './BookingStatusBadge';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';
import Button from '../../../ui/Button';

interface BookingsListProps {
  onEditBooking: (booking: any) => void;
}

const BookingsList: React.FC<BookingsListProps> = ({ onEditBooking }) => {
  const { hasGlobalAccess, assignedLodges, hasPermission } = useAuth();
  const { bookings, updateBookingStatus, searchBookings } = useBookings();
  const { lodges } = useLodges();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortField, setSortField] = useState<string>('checkIn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter bookings based on access
  const filteredBookings = React.useMemo(() => {
    let accessibleBookings = hasGlobalAccess 
      ? bookings 
      : bookings.filter(booking => {
          const lodge = lodges.find(l => l.name === booking.lodgeName);
          return lodge ? assignedLodges.includes(lodge.id) : false;
        });

    // Sort bookings
    return accessibleBookings.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [bookings, hasGlobalAccess, assignedLodges, lodges, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (booking: any, newStatus: string) => {
    if (hasPermission('manage_bookings') || hasPermission('manage_bookings_assigned')) {
      await updateBookingStatus(booking.id, newStatus);
    }
  };

  const getStatusActions = (booking: any) => {
    const actions = [];
    
    switch (booking.status) {
      case 'pending':
        actions.push(
          <Button
            key="confirm"
            size="sm"
            onClick={() => handleStatusChange(booking, 'confirmed')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Confirm
          </Button>
        );
        actions.push(
          <Button
            key="cancel"
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(booking, 'cancelled')}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Cancel
          </Button>
        );
        break;
      case 'confirmed':
        actions.push(
          <Button
            key="checkin"
            size="sm"
            onClick={() => handleStatusChange(booking, 'checked_in')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Check In
          </Button>
        );
        break;
      case 'checked_in':
        actions.push(
          <Button
            key="checkout"
            size="sm"
            onClick={() => handleStatusChange(booking, 'checked_out')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Check Out
          </Button>
        );
        break;
    }
    
    return actions;
  };

  if (filteredBookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CalendarDaysIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-600">
          {hasGlobalAccess 
            ? 'No bookings have been created yet.'
            : 'No bookings found for your assigned lodges.'
          }
        </p>
      </div>
    );
  }

  if (viewMode === 'cards') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Switch to Table View
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onEdit={onEditBooking}
              statusActions={getStatusActions(booking)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Bookings ({filteredBookings.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode('cards')}
        >
          Switch to Card View
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('guestName')}
              >
                Guest
                {sortField === 'guestName' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('lodgeName')}
              >
                Lodge/Room
                {sortField === 'lodgeName' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('checkIn')}
              >
                Dates
                {sortField === 'checkIn' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Guests
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                Amount
                {sortField === 'amount' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.guestName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.guestEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.lodgeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.roomName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    to {new Date(booking.checkOut).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.guests}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${booking.amount.toFixed(2)}
                  </div>
                  {booking.deposit > 0 && (
                    <div className="text-sm text-gray-500">
                      ${booking.deposit} deposit
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    booking.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : booking.paymentStatus === 'partial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {getStatusActions(booking).slice(0, 1)}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditBooking(booking)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsList;