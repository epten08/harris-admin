import React from 'react';

interface BookingStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Pending',
          icon: '⏳'
        };
      case 'confirmed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Confirmed',
          icon: '✓'
        };
      case 'checked_in':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Checked In',
          icon: '🏨'
        };
      case 'checked_out':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Checked Out',
          icon: '✅'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Cancelled',
          icon: '❌'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Unknown',
          icon: '?'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${config.color} ${sizeClasses[size]}`}>
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default BookingStatusBadge;