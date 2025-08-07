import React from 'react';
import BookingStatusBadge from './BookingStatusBadge';
import {
  UserIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface BookingCardProps {
  booking: any;
  onEdit: (booking: any) => void;
  statusActions: React.ReactNode[];
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onEdit, statusActions }) => {
  const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const nights = getDaysBetween(booking.checkIn, booking.checkOut);
  const isToday = (date: string) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{booking.guestName}</h3>
            <p className="text-sm text-gray-600">Booking #{booking.id.slice(-6)}</p>
          </div>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">{booking.lodgeName}</p>
            <p className="text-gray-600">{booking.roomName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p className="text-gray-600">{nights} night{nights !== 1 ? 's' : ''} • {booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">${booking.amount.toFixed(2)}</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                booking.paymentStatus === 'paid' 
                  ? 'bg-green-100 text-green-700'
                  : booking.paymentStatus === 'partial'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {booking.paymentStatus}
              </span>
              {booking.deposit > 0 && (
                <span className="text-gray-500">• ${booking.deposit} deposit</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-gray-200 pt-3 mb-4">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <EnvelopeIcon className="w-3 h-3" />
            <span className="truncate">{booking.guestEmail}</span>
          </div>
          {booking.guestPhone && (
            <div className="flex items-center gap-1">
              <PhoneIcon className="w-3 h-3" />
              <span>{booking.guestPhone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Special Alerts */}
      {(isToday(booking.checkIn) || isToday(booking.checkOut)) && (
        <div className={`mb-4 p-2 rounded-lg text-xs font-medium ${
          isToday(booking.checkIn) 
            ? 'bg-blue-50 text-blue-700'
            : 'bg-green-50 text-green-700'
        }`}>
          {isToday(booking.checkIn) ? '📅 Checking in today' : '🎯 Checking out today'}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <button
          onClick={() => onEdit(booking)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </button>
        <div className="flex items-center gap-2">
          {statusActions}
        </div>
      </div>

      {/* Special Requests */}
      {booking.specialRequests && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
          <p className="font-medium text-gray-700 mb-1">Special Requests:</p>
          <p className="text-gray-600">{booking.specialRequests}</p>
        </div>
      )}
    </div>
  );
};

export default BookingCard;